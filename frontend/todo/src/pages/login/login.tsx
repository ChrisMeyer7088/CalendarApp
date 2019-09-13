import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './login.css';
import { PostUser } from '../../interfaces/requests';
import { requestLoginUser } from '../../services/userRequests';

interface State {
    username: string,
    password: string,
    redirectToHome: boolean,
    attemptedLogin: boolean,
}

class LoginPage extends React.Component<null, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: "",
            redirectToHome: false,
            attemptedLogin: false,
        }
    }

    render() {
        const { loginAttempt, state, updateUsername, updatePassword, checkEnterKey } = this;
        const { username, password, redirectToHome, attemptedLogin }  = state
        if(redirectToHome) {
            return (
            <Redirect to={{pathname: "/home"}} />
            )
        }
        return (
            <div className="container-main">
                <h1 className="h1-title">Calendar Login</h1>
                <div hidden={!attemptedLogin}>
                    <p className="warningText">Invalid Username or Password</p>
                </div>
                <div>
                    <h3>UserName</h3>
                    <input value={username} onChange={e => updateUsername(e)} placeholder="username" type="text"></input>
                    <h3>Password</h3>
                    <input placeholder="password" value={password} onChange={e => updatePassword(e)} type="password"
                    onKeyPress={e => checkEnterKey(e)}></input>
                </div>
                <button className="button-submit" onClick={() => loginAttempt()}>Login</button>
                <p>Don't have an account? Register <Link to="/register">here!</Link></p>
            </div>
        )
    }

    updateUsername = (event: any) => {
        this.setState({
            username: event.target.value
        })
    }

    updatePassword = (event: any) => {
        this.setState({
            password: event.target.value
        })
    }

    //Send login request to backend
    loginAttempt = () => {
        const { username, password } = this.state;
        if(!username || !password) return
        const requestBody: PostUser = {
            username,
            password
        }
        requestLoginUser(requestBody)
            .then(res => {
                if(res.data.data.loggedIn) {
                    sessionStorage.setItem("token", res.data.data.token)
                    this.setState({
                        redirectToHome: true,
                        attemptedLogin: false,
                    })
                } else {
                    this.setState({
                        attemptedLogin: true
                    })
                }
                
            })
            .catch(err => {
                console.error(err)
            })
    }

    checkEnterKey = (e: any) => {
        if(e.key === "Enter") {
            this.loginAttempt();
        }
    }
}

export default LoginPage;