import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUserNotices } from '../../services/infoRequests';
import './home.css';
import Header from '../../components/header/header';
import HamburgerMenu from '../../components/hamburgerMenu/hamburgerMenu';
import { getUniqueId } from '../../services/addNotice';
import { Notice } from '../../interfaces/requests';

interface State {
    userId: string,
    token: string,
    redirectToLogin: boolean,
    selectedDate: Date,
    eventMap: Map<string, Map<string, Notice[]>>
}

class HomePage extends React.Component<null, State> {
    private DATES: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    constructor(props: any) {
        super(props);
        this.state = {
            userId: "",
            token: localStorage.getItem("token") || "",
            redirectToLogin: false,
            selectedDate: new Date(),
            eventMap: new Map()
        }
    }

    render() {
        const { returnToLogin, renderCalendarDayHeaders, renderCalendarDays, setMonth } = this;
        const { redirectToLogin, token, selectedDate } = this.state

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }
        return (
            <div className="container-content">
                <HamburgerMenu />
                <div className="flex-container">
                    <Header selectedDate={selectedDate} token={token} returnToLogin={returnToLogin} 
                    setMonth={setMonth} />
                    <div className="container-calender">
                        <table id="calendar">
                            <tbody>
                                {renderCalendarDayHeaders()}
                                {renderCalendarDays()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.retrieveNotices(this.state.selectedDate);
    }


    //Renders CalendarDays using information from the selected days
    renderCalendarDays = () => {
        const { getFullCalendarDays, localDateToDisplayString, changeSelectedDate, renderDayEvents } = this;
        const { selectedDate } = this.state;

        let allDays: Date[] = getFullCalendarDays(selectedDate.getMonth(), selectedDate.getFullYear());

        //Splits the days into weekly increments to display in table rows
        let daysInWeekIncremenets: Date[][] = [[]];
        let rowIndex = 0;
        for(let index = 0; index < allDays.length; index++) {
            if(index % 7 === 0 && index !== 0) {
                daysInWeekIncremenets.push([])
                rowIndex++;
            }
            daysInWeekIncremenets[rowIndex].push(allDays[index]);
        }

        return (
            daysInWeekIncremenets.map(weekArr => {
                return (
                    <tr key={getUniqueId()}>
                        {weekArr.map(day => {
                            //Sets an id on the selected date
                            if(day.getMonth() === selectedDate.getMonth() && day.getDate() === selectedDate.getDate()) {
                                return (
                                    <td key={getUniqueId()} onClick={() => changeSelectedDate(day)} className="calendar-day" id="selected-day" >
                                        <div>
                                            <div className="container-day-number">
                                                {localDateToDisplayString(day)}
                                            </div>
                                            {renderDayEvents(day)}
                                        </div>
                                    </td>
                                )
                            } else {
                                return (
                                    <td key={getUniqueId()} onClick={() => changeSelectedDate(day)} className="calendar-day">
                                        <div>
                                            <div className="container-day-number">
                                                {localDateToDisplayString(day)}
                                            </div>
                                            {renderDayEvents(day)}
                                        </div>
                                    </td>
                                )
                            }
                        })}
                    </tr>
                )
            })
                   
        )
    }

    //Retrieves the events of the particular day and renders them
    renderDayEvents = (date: Date) => {
        const { getTextColor } = this;
        const { eventMap } = this.state;
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let arr: Notice[] = [];

        //Get all the notices of the day
        let monthMap = eventMap.get(year + '-' + month);
        if(monthMap) {
            let dayMap = monthMap.get(day.toString());
            if(dayMap) {
                //Add all notices of the day to the array and sort them
                let iterator = dayMap.entries();
                let result = iterator.next();
                while(!result.done) {
                    arr.push(result.value[1])
                    result = iterator.next();
                }
                //Sort the array by beginDate
                arr.sort((a, b) => {
                    if(a.beginDate > b.beginDate) return 1;
                    if(a.beginDate === b.beginDate) return 0;
                    return -1;
                })

                //Render all events
                return (
                    arr.map((event: Notice) => {
                        let color = getTextColor(event.color + event.title);
                        return (
                            <div style={{backgroundColor: "#"+event.color, color}} className="calendar-event" key={getUniqueId()}>
                                <div className="calendar-event-title">
                                    {event.title}
                                </div>
                            </div>
                        )
                    })
                )
            }
        }

        return (
            <div></div>
        )
    }

    renderCalendarDayHeaders = () => {
        return (
                <tr className="calendar-row-dates">
                    {this.DATES.map(day => {
                        return (
                            <th key={getUniqueId()} className="calendar-header-dates">
                                <div>
                                    {day}
                                </div>
                            </th>
                        )
                    })}
                </tr>
        )
    }

    //EventMap key String: yyyy-mm
    retrieveNotices = (selectedDate: Date) => {
        getUserNotices(this.state.token, selectedDate)
            .then(res => {
                let notices = res.data.data.notices;
                let eventMap = this.state.eventMap;
                for(let i = 0; i < notices.length; i++) {
                    let beginDate = new Date(notices[i].begindate);
                    let month: string = (beginDate.getMonth() + 1).toString();
                    let year: string = beginDate.getFullYear().toString();
                    let day: string = beginDate.getDate().toString();
                    let idString = year + '-' + month;

                    // eventMap<string, dayMap<string, eventIdMap<number, Notice>>
                    let dayMap = eventMap.get(idString) || new Map();
                    let eventIdMap: Map<string, Notice> = dayMap.get(day) || new Map();
                    eventIdMap.set(notices[i].id.toString(), {
                        beginDate,
                        endDate: new Date(notices[i].enddate),
                        title: notices[i].title,
                        color: notices[i].color,
                        description: notices[i].description
                    })
                    dayMap.set(day, eventIdMap);
                    eventMap.set(idString, dayMap);
                }
                this.setState({
                    eventMap
                })
            })
            .catch(err => {
                if(!err.response || !err.response.status) return;
                if(err.response.status === 401) {
                    this.returnToLogin();
                }
            })
    }

    returnToLogin = () => {
        localStorage.removeItem('token')
        this.setState({
            redirectToLogin: true
        })
    }

    changeSelectedDate = (newDate: Date) => {
        this.setState({
            selectedDate: newDate
        })
    }

    setMonth = (newMonth: number) => {
        let selectedDate: Date = this.state.selectedDate;
        selectedDate.setMonth(newMonth);
        this.retrieveNotices(selectedDate)
        this.setState({
            selectedDate
        })
    }

    private getDaysFromMonth = (month: number, year: number) => {
        let currentMonth = new Date(year, month, 1);
        let days: Date[] = [];
        while(currentMonth.getMonth() === month ) {
            days.push(new Date(currentMonth))
            currentMonth.setDate(currentMonth.getDate() + 1);
        }

        return days;
    }

    private getFullCalendarDays = (month: number, year: number) => {
        let days: Date[] = this.getDaysFromMonth(month, year);

        let counter = 0;
        //While the first day is not Sunday
        while(days[0].getDay() !== 0) {
            days.unshift(new Date(year, month, -1 * (counter)))
            counter++;
        }

        //While the last day is not a Saturday
        while(days[days.length - 1].getDay() !== 6) {
            days.push(new Date(days[days.length - 1].getFullYear(), days[days.length - 1].getMonth(), days[days.length - 1].getDate() + 1))
        }
        return days;
    }

    private localDateToDisplayString = (date: Date): string => {
        let day = date.getDate();
        let dayAsString: string = day.toString();
        return `${dayAsString}`
    }

    //ex format: getTextColor('00aaff')
    private getTextColor = (hex: string): string => {
        let rgb = this.hexToRGB(hex);
        if(rgb.red > 180 || rgb.green > 180 || rgb.blue > 180) return '#000000'
        return '#ffffff';
    }

    private hexToRGB = (hex: string): {red:number, green:number, blue:number} => {
        const { hexToNumber } = this;

        if(hex.length !== 6) return {red: 0, green: 170, blue: 255};
        let red = hexToNumber(hex.substr(0, 2));
        let green = hexToNumber(hex.substr(2, 2));
        let blue = hexToNumber(hex.substr(4, 2));
        return {red, green, blue};
    }

    private hexToNumber = (hex: string) : number => {
        hex = hex.toLowerCase();
        const ACHARVALUE: number = 97;
        let value: number = 0;
        let charValue: number = 0;
        let addedValue: number = 0;
        for(let i = 0; i < hex.length; i++) {
            charValue = parseInt(hex[i])
            //Check if it is a letter then get hexvalue of letter
            if(!charValue && charValue !== 0) charValue = (hex.charCodeAt(i) - ACHARVALUE) + 10;
            addedValue = charValue * (16 ** (hex.length - i - 1));
            value += addedValue;
        }
        return value;
    }
}

export default HomePage;