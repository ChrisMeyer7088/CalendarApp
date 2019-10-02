import React from 'react';
import './header.css';
import AddNoticeButton from '../../components/addNoticeButton/addNoticeButton';
import HamburgerMenu from '../../components/hamburgerMenu/hamburgerMenu'

interface Props {
    selectedDate: Date,
    token: string,
    returnToLogin: any,
    setMonth: any
}

class Header extends React.Component<Props> {
    private MONTHS: string[] = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];

    render() {
        const { token, returnToLogin, selectedDate} = this.props;
        const { renderCalendarMonth, renderCalendarYear} = this;
        return (
            <div className="container-header">
                <div className="header">
                    <HamburgerMenu />
                    <AddNoticeButton token={token} returnToLogin={returnToLogin} selectedDate={selectedDate}/>
                    {renderCalendarMonth()}
                    {renderCalendarYear()}
                </div>
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
        const { getMonthInput } = this;
        const { setMonth, selectedDate } = this.props;

        return (
            <div className="container-calendar-month">
                <div className="selector-left" onClick={() => setMonth(selectedDate.getMonth() - 1)}>{"<"}</div>
                <div className="month-header header-grey" onClick={() => setMonth(selectedDate.getMonth() - 2)}>
                    {this.MONTHS[getMonthInput(-2)].substr(0,3)}
                </div>
                <div className="month-header header-grey" onClick={() => setMonth(selectedDate.getMonth() - 1)}>
                    {this.MONTHS[getMonthInput(-1)]}
                </div>
                <div className="month-header">
                    {this.MONTHS[selectedDate.getMonth()]}
                </div>
                <div className="month-header  header-grey" onClick={() => setMonth(selectedDate.getMonth() + 1)}>
                    {this.MONTHS[getMonthInput(1)]}
                </div>
                <div className="month-header header-grey" onClick={() => setMonth(selectedDate.getMonth() + 2)}>
                    {this.MONTHS[getMonthInput(2)].substr(0,3)}
                </div>
                <div className="selector-right" onClick={() => setMonth(selectedDate.getMonth() + 1)}>{">"}</div>
            </div>
        )
    }

    private getMonthInput = (monthNumber: number): number => {
        const { MONTHS } = this;
        const { selectedDate } = this.props;

        let newMonth = selectedDate.getMonth() + monthNumber;
        if(newMonth < 0) newMonth = MONTHS.length + newMonth;
        if(newMonth > MONTHS.length - 1) newMonth = newMonth - MONTHS.length;
        return newMonth;
    }

}

export default Header;