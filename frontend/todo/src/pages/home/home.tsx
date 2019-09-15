import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUserNotices } from '../../services/infoRequests';
import AddNoticeButton from '../../components/addNoticeButton/addNoticeButton';

interface State {
    userId: string,
    token: string,
    redirectToLogin: boolean,
    notices: Object[],
    selectedDate: Date
}

class HomePage extends React.Component<null, State> {

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
        const { returnToLogin } = this;
        const { redirectToLogin, token, selectedDate } = this.state

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }
        return (
            <div>
                <h1>Welcome to the ToDoApp</h1>
                <AddNoticeButton token={token} returnToLogin={returnToLogin} selectedDate={selectedDate}/>
            </div>
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
}

export default HomePage;