import React from 'react';
import './retrieveAccount.css';
import { Link, Redirect } from 'react-router-dom';

interface State {
    email: string,
    showResetSentMessage: boolean,
    returnToLogin: boolean
}

class RetrieveAccountPage extends React.Component<null, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            showResetSentMessage: false,
            returnToLogin: false
        }
    }

    render() {
        const { updateEmail, sendPasswordResetLink } = this;
        const { email, showResetSentMessage, returnToLogin } = this.state;

        if(returnToLogin) {
            return (
                <Redirect to={{pathname: "/login"}} />
            )
        }

        return (
            <div className="container-main">
                <div className="login-form">
                    <div className="container-login-data">
                        <h1 className="login-header">Password Reset:</h1>
                        <div className="container-input">
                            <input value={email} onChange={e => updateEmail(e)} placeholder="Email" type="text"
                            className="input-field"></input>
                        </div>
                        <button className="button-submit" onClick={() => sendPasswordResetLink()}>Send</button>
                        <div className="reset-popup" hidden={!showResetSentMessage}>
                            Password Reset Link Sent!
                        </div>
                        <p>Back to <Link className="page-link" to="/login">Login!</Link></p>
                    </div>
                </div>
            </div>
        )
    }

    updateEmail = (event: any) => {
        this.setState({
            email: event.target.value
        })
    }

    sendPasswordResetLink = () => {
        this.setState({
            showResetSentMessage: true
        })
        setTimeout(() => {
            this.setState({
                returnToLogin: true
            })
        },1000)
    }
}

export default RetrieveAccountPage