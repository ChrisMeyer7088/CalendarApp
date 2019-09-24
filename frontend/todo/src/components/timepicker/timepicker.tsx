import React from 'react';
import './timepicker.css';
import { getUniqueId, formatTimeString } from '../../services/addNotice';
import { Time } from '../../interfaces/addNoticePopup';

interface State {
    time: Time,
    divId: string,
    showTimeSelector: boolean,
    userInputString: string,
    isUserTypingTime: boolean
}

interface Props {
    startDate: Date,
    endDate?: Date,
    updateBeginDate: any,
    updateEndDate: any
}

class TimePicker extends React.Component<Props, State> {
    private timeRef = React.createRef<HTMLDivElement>();
    private popupTime = React.createRef<HTMLDivElement>();
    constructor(props: any) {
        super(props);

        const { startDate, endDate } = this.props;
        let defaultStartTime = new Date();

        if(startDate) defaultStartTime = startDate;

        let time: Time = {
            minutes: defaultStartTime.getMinutes(),
            hours: defaultStartTime.getHours()
        }

        if(endDate) {
            time = {
                minutes: endDate.getMinutes(),
                hours: endDate.getHours()
            }
        };

        this.state = {
            time,
            divId: getUniqueId('popuptime-'),
            showTimeSelector: false,
            userInputString: '',
            isUserTypingTime: false
        }
    }

    render() {
        const { togglePopup, validUserTypedTime, updateUserInputString, renderTime } = this;
        const { time, showTimeSelector, userInputString, isUserTypingTime } = this.state;

        let beginTimeString: string = formatTimeString(time);
        if(userInputString || isUserTypingTime) beginTimeString = userInputString;        

        return(
            <div className="container-popup-time">
                <div ref={this.timeRef} onClick={e => togglePopup(true)}>
                    <input className="popup-time" onBlur={e => validUserTypedTime()} onFocus={e => e.target.select()}
                    onChange={e => updateUserInputString(e)} value={beginTimeString} type="text"></input>
                    <div hidden={!showTimeSelector} className="container-popup">
                        <div className="popup">
                            <ul className="popup-inner">
                                {renderTime()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate = () => {
        const { endDate, startDate, updateEndDate } = this.props;
        if(endDate && startDate > endDate) {
            let endTime = new Date(startDate.getTime());
            endTime.setMinutes(endTime.getMinutes() + 30);
            let time: Time = {
                minutes: endTime.getMinutes(),
                hours: endTime.getHours()
            }
            updateEndDate(endTime);
            this.setState({
                time
            })
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    togglePopup = (bool: boolean) => {
        if(this.state.showTimeSelector !== bool) {
            this.setState({
                showTimeSelector: bool
            })

            if(bool) {
                let node = this.popupTime.current;
                setTimeout(() => {
                    if(node) {
                        node.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        })
                    }
                }, 100)
            }
        }
    }

    setTime = (time: Time) => {
        this.setState({
            time
        })
        if(this.props.endDate) this.props.updateEndDate(this.timeToDate(time));
        else this.props.updateBeginDate(this.timeToDate(time));
    }

    updateUserInputString = (event: any) => {
        let newUserInput: string = event.target.value
        this.setState({
            userInputString: newUserInput.toUpperCase(),
            isUserTypingTime: true
        })
    }

    //Checks the user input string to see if it is a valid typed time, if so update time to typed value
    validUserTypedTime = () => {
        const { userInputString } = this.state;
        if(userInputString.includes(':')) {
            let userInputArr = userInputString.split(":");
            let hoursString = userInputArr[0];
            let minutes = userInputArr[1].substring(0, userInputArr[1].length - 2).replace(/\s/g, '');
            let ampm = userInputArr[1].substring(userInputArr[1].length - 2, userInputArr[1].length);
            if(hoursString.length < 3 && hoursString.length > 0 && minutes.length > 0 && minutes.length < 3 && 
                (ampm === "AM" || ampm === "PM")) {
                let hoursIsNum = /^\d+$/.test(hoursString);
                let minutesIsNum = /^\d+$/.test(minutes);
                if(hoursIsNum && minutesIsNum) {
                    let hours: number = parseInt(hoursString);
                    if(ampm === "PM" && hours < 13) hours += 12
                    let newTime: Time = {
                        hours,
                        minutes: parseInt(minutes)
                    }
                    if(this.isEndTimeValid(newTime)) this.setTime(newTime);
                }
                    
            }
        }
        this.setState({
            userInputString: '',
            isUserTypingTime: false
        })
    }

    handleClickOutside = (event: any) => {
        let node = this.timeRef.current;
        if(node && !node.contains(event.target))
            this.togglePopup(false)
    }

    getAvailableTime = (): Time[] => {
        const  { isEndTimeValid } = this;
        let availableTime: Time[] = [];
        let newTime: Time;

        for(let i = 0; i < 24; i++) {
            newTime = {
                minutes: 0,
                hours: i === 0? 24 : i
            }
            if(isEndTimeValid(newTime)) availableTime.push(newTime);

            newTime = {
                minutes: 30,
                hours: i === 0? 24 : i
            }
            if(isEndTimeValid(newTime)) availableTime.push(newTime);
            
        }
        return availableTime
    }

    //Checks if newTime is valid in comparison to the begin date, if this is begin date it is valid
    private isEndTimeValid = (newTime: Time): boolean => {
        const { startDate, endDate} = this.props

        if(endDate) {
            let comparisonDate = new Date(endDate.getTime());
            if(newTime.hours === 24) newTime.hours = 0;
            comparisonDate.setHours(newTime.hours);
            comparisonDate.setMinutes(newTime.minutes);
            if(comparisonDate > startDate) return true;
        } else return true;

        return false;
    }

    renderTime = () => {
        let availableTime = this.getAvailableTime();
        return (
            <div>
                {availableTime.map(time => {
                    if(this.state.time.hours === time.hours) {
                        return (
                            <div ref={this.popupTime} className="time-selection-item"
                            onClick={e => {this.selectTimeEvent(time)}}>
                                {formatTimeString(time)}
                            </div>
                        ) 
                    }
                    else return (
                        <div className="time-selection-item" key={getUniqueId(formatTimeString(time))} 
                        onClick={e => this.selectTimeEvent(time)}>
                            {formatTimeString(time)}
                        </div>
                    )
                })}
            </div>
        );
    }

    selectTimeEvent = (time: Time) => {
        this.togglePopup(false);
        this.setTime(time)
    }

    private timeToDate = (newTime: Time): Date => {
        const { startDate, endDate } = this.props;
        let convertedDate = startDate;
        if(endDate) convertedDate = endDate;

        convertedDate.setHours(newTime.hours);
        convertedDate.setMinutes(newTime.minutes);
        return convertedDate;
    }
}

export default TimePicker;