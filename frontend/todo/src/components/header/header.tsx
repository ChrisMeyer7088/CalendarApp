import React from 'react';
import './header.css';
import AddNoticeButton from '../../components/addNoticeButton/addNoticeButton';

interface Props {
    selectedDate: Date,
    token: string,
    returnToLogin: any,
    incrementMonth: any,
    decrementMonth: any
}

class Header extends React.Component<Props> {
    private MONTHS: string[] = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];

    render() {
        const { token, returnToLogin, selectedDate} = this.props;
        const { renderCalendarMonth, renderCalendarYear} = this;
        return (
            <div>
                <AddNoticeButton token={token} returnToLogin={returnToLogin} selectedDate={selectedDate}/>
                {renderCalendarYear()}
                {renderCalendarMonth()}
            </div>
        )
    }

    renderCalendarYear = () => {
        const { selectedDate } = this.props;
        return (
            <div className="container-calendar-year">
                {selectedDate.getFullYear()}
            </div>
        )
    }

    renderCalendarMonth = () => {
        const {decrementMonth, incrementMonth} = this.props;
        const { selectedDate } = this.props;

        return (
            <div className="container-calendar-month">
                <div className="selector-left" onClick={() => decrementMonth()}>{"<"}</div>
                {this.MONTHS[selectedDate.getMonth()]}
                <div className="selector-right" onClick={() => incrementMonth()}>{">"}</div>
            </div>
        )
    }

}

export default Header;