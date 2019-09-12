import React from 'react';
import { Redirect } from 'react-router-dom';
import { requestUserNotices, requestAuthenticateSession } from '../../services/infoRequests';

interface State {
    userId: string,
    token: string,
    redirectToLogin: boolean,
    notices: Object[]
}

class HomePage extends React.Component<null, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            userId: "",
            token: "",
            redirectToLogin: false,
            notices: []
        }

        this.authenticateUser();
    }

    render() {
        const { redirectToLogin } = this.state

        if(redirectToLogin) {
            return (<Redirect to="/login"/>)
        }
        return (
            <div>
                <h1>Welcome to the ToDoApp</h1>
            </div>
        )
    }

    //Check for valid user token and retrieve user data from token
    authenticateUser = () => {
        requestAuthenticateSession(sessionStorage.getItem('todoAppToken') || '')
            .then(res => {
                if(res.data.data.returnToLogin) {
                    this.returnToLogin();
                } else {
                    sessionStorage.setItem('userId', res.data.data.userId)
                    this.setState({
                        userId: res.data.data.userId,
                        token: sessionStorage.getItem('todoAppToken') || ''
                    })
                    this.retrieveNotices();
                }
            })
            .catch(err => {
                console.error(err);
                sessionStorage.removeItem('todoAppToken')
                this.setState({
                    redirectToLogin: true
                })
            })
    }

    retrieveNotices = () => {
        const {token, userId} = this.state;
        requestUserNotices(token, userId)
            .then(res => {
                console.log(res)
                if(res.data.data.returnToLogin) {
                    this.returnToLogin();
                } else {
                    this.setState({
                        notices: res.data.data.notices
                    })
                }
            })
            .catch(err => console.error(err))
    }

    returnToLogin = () => {
        sessionStorage.removeItem('todoAppToken')
        this.setState({
            redirectToLogin: true
        })
    }
}

export default HomePage;