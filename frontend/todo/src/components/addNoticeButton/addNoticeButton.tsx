import React from 'react';
import './addNoticeButton.css';
import { postNotice } from '../../services/infoRequests';
import { Notice } from '../../interfaces/requests';
import Popup from 'reactjs-popup';

interface Props {
    token: string,
    returnToLogin: any
}

interface State {
    notice: Notice
}

class AddNoticeButton extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            notice: {
                title: "Event Title",
                beginDate: new Date(),
                endDate: new Date(),
                color: ""
            }
        }
    }

    render() {
        const { addNotice, renderTitle } = this;
        const { title, beginDate, endDate, color } = this.state.notice;

        return(
            <div>
                <Popup trigger={<button>Create Event</button>}>
                    <div>
                        <input type="text" value={title} onChange={e => renderTitle(e)}></input>
                        <label>Start Time:</label><input type="time"></input>
                        <label>End Time:</label><input type="time"></input>
                        <label>Start Date:</label><input type="date"></input>
                        <label>End Date:</label><input type="date"></input>

                    </div>
                </Popup>
                
            </div>
        )
    }

    renderTitle = (event: any) => {
        let notice = this.state.notice;
        notice.title = event.target.value;
        this.setState({
            notice
        })
    }

    addNotice = () => {
        postNotice(this.props.token, this.state.notice)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export default AddNoticeButton;