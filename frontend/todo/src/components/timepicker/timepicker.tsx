import React from 'react';
import './timepicker.css';
import { getUniqueId, formatTimeString } from '../../services/addNotice';
import { Time } from '../../interfaces/addNoticePopup';

interface State {
    time: Time,
    divId: string,
    showTimeSelector: boolean,
    userInputString: string,
    isUserTypingTime: boolean,
    availableTime: Time[]
}

interface Props {
    time?: Date,
}

class TimePicker extends React.Component<Props, State> {
    private timeRef = React.createRef<HTMLDivElement>();
    private popupTime = React.createRef<HTMLDivElement>()
    constructor(props: any) {
        super(props);

        const { time } = this.props;
        let defaultStartTime = new Date();
        if(time) defaultStartTime = time;

        let availableTime = this.getAvailableTime();

        this.state = {
            time: {
                minutes: defaultStartTime.getMinutes(),
                hours: defaultStartTime.getHours()
            },
            divId: getUniqueId('popuptime-'),
            showTimeSelector: false,
            userInputString: '',
            isUserTypingTime: false,
            availableTime
        }
    }

    render() {
        const { togglePopup, validUserTypedTime, updateUserInputString, renderTime } = this;
        const { time, showTimeSelector, userInputString, isUserTypingTime } = this.state;

        let beginTimeString: string = formatTimeString(time);
        if(userInputString || isUserTypingTime) beginTimeString = userInputString;

        return(
            <div ref={this.timeRef} onClick={e => togglePopup(true)} className="container-popup-time">
                <input className="popup-time" onBlur={e => validUserTypedTime(true)} 
                onChange={e => updateUserInputString(e)} value={beginTimeString} type="text"></input>
                <div hidden={!showTimeSelector}>
                    <div className="popup">
                        <ul className="popup-inner">
                            {renderTime()}
                        </ul>
                    </div>
                </div>
            </div>
        );
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
    }

    updateUserInputString = (event: any) => {
        let newUserInput: string = event.target.value
        this.setState({
            userInputString: newUserInput.toUpperCase(),
            isUserTypingTime: true
        })
    }

    validUserTypedTime = (shouldUpdateTime: boolean): boolean => {
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
                    if(shouldUpdateTime) {
                        let hours: number = parseInt(hoursString);
                        if(ampm === "PM" && hours < 13) hours += 12
                        let newTime: Time = {
                            hours,
                            minutes: parseInt(minutes)
                        }
                        this.setState({
                            time: newTime,
                            isUserTypingTime: false
                        })
                    }
                    
                    return true;
                }
            }
        }
        if(shouldUpdateTime) {
            this.setState({
                userInputString: '',
                isUserTypingTime: false
            })
        }        
        return false;
    }

    handleClickOutside = (event: any) => {
        let node = this.timeRef.current;
        if(node && !node.contains(event.target))
            this.togglePopup(false)
    }

    getAvailableTime = (): Time[] => {
        let availableTime: Time[] = [];
        let newTime: Time;
        for(let i = 0; i < 24; i++) {
            newTime = {
                minutes: 0,
                hours: i === 0? 24 : i
            }
            availableTime.push(newTime)
            newTime = {
                minutes: 30,
                hours: i === 0? 24 : i
            }
            availableTime.push(newTime)
        }

        return availableTime
    }

    renderTime = () => {
        return (
            <div>
                {this.state.availableTime.map(time => {
                    if(this.state.time.hours === time.hours) {
                        return (
                            <div ref={this.popupTime} className="time-selection-item"
                            onClick={e => this.selectTimeEvent(time)}>
                                {formatTimeString(time)}
                            </div>
                        ) 
                    }
                    else return (
                        <div className="time-selection-item" key={getUniqueId(formatTimeString(time))} onClick={e => this.selectTimeEvent(time)}>
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
}

export default TimePicker;