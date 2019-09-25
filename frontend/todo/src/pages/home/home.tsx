import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUserNotices } from '../../services/infoRequests';
import AddNoticeButton from '../../components/addNoticeButton/addNoticeButton';
import './home.css';

interface State {
    userId: string,
    token: string,
    redirectToLogin: boolean,
    notices: Object[],
    selectedDate: Date
}

class HomePage extends React.Component<null, State> {
    private DATES: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    private MONTHS: string[] = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"]

    constructor(props: any) {
        super(props);
        this.state = {
            userId: "",
            token: sessionStorage.getItem("token") || "",
            redirectToLogin: false,
            notices: [],
            selectedDate: new Date()
        }
        this.retrieveNotices();
    }

    render() {
        const { returnToLogin,renderCalendarDayHeaders, renderCalendarYear, renderCalendarMonth, 
            renderCalendarDays } = this;
        const { redirectToLogin, token, selectedDate } = this.state

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }
        return (
            <div id="container-calendar">
                <AddNoticeButton token={token} returnToLogin={returnToLogin} selectedDate={selectedDate}/>
                    {renderCalendarYear()}
                    {renderCalendarMonth()}
                <table id="calendar">
                    <tbody>
                        {renderCalendarDayHeaders()}
                        {renderCalendarDays()}
                    </tbody>
                </table>
            </div>
        )
    }

    renderCalendarDays = () => {
        const { getFullCalendarDays, localDateToDisplayString } = this;
        const { selectedDate } = this.state;

        let allDays: Date[] = getFullCalendarDays(selectedDate.getMonth(), selectedDate.getFullYear());
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
                    <tr>
                        {weekArr.map(day => {
                            return (
                                <td className="calendar-day">
                                    <div>
                                        <div className="container-day-number">{localDateToDisplayString(day)}</div>
                                    </div>
                                </td>
                            )
                        })}
                    </tr>
                )
            })
                   
        )
    }

    renderCalendarYear = () => {
        const { selectedDate } = this.state;
        return (
            <div className="container-calendar-year">
                {selectedDate.getFullYear()}
            </div>
        )
    }

    renderCalendarMonth = () => {
        const { selectedDate } = this.state;

        return (
            <div className="container-calendar-month">
                {this.MONTHS[selectedDate.getMonth()]}
            </div>
        )
    }

    renderCalendarDayHeaders = () => {
        return (
                <tr className="calendar-row-dates">
                    {this.DATES.map(day => {
                        return (
                            <th className="calendar-header-dates">
                                <div>
                                    {day}
                                </div>
                            </th>
                        )
                    })}
                </tr>
        )
    }

    retrieveNotices = () => {
        getUserNotices(this.state.token)
            .then(res => {
                if(res.data.data.returnToLogin) {
                    this.returnToLogin();
                } else {
                    this.setState({
                        notices: res.data.data.notices
                    })
                }
            })
            .catch(err => {
                if(err.response.status === 400) {
                    this.returnToLogin();
                }
            })
    }

    returnToLogin = () => {
        sessionStorage.removeItem('token')
        this.setState({
            redirectToLogin: true
        })
    }

    private getDaysFromMonth = (month: number, year: number) => {
        let currentDate = new Date(year, month, 1);
        let days: Date[] = [];
        while(currentDate.getMonth() === month ) {
            days.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    }

    private getFullCalendarDays = (month: number, year: number) => {
        let days: Date[] = this.getDaysFromMonth(month, year);

        let counter = 0;
        while(days[0].getDay() !== 0) {
            days.unshift(new Date(year, month, -1 * (counter)))
            counter++;
        }

        while(days[days.length - 1].getDay() !== 6) {
            days.push(new Date(year, month, days.length + 1))
            counter++;
        }

        return days;
    }

    private localDateToDisplayString = (date: Date): string => {
        let day = date.getDate();
        let dayAsString: string = day.toString();
        return `${dayAsString}`
    }
}

export default HomePage;