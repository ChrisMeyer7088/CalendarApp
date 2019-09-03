import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './login.css';
import { PostUser } from '../../interfaces/requests';
import { requestLoginUser } from '../../services/authentication';

interface State {
    username: string,
    password: string,
    redirectToHome: boolean
}

class LoginPage extends React.Component<null, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: "",
            redirectToHome: false
        }
    }

    render() {
        const { loginAttempt, state, updateUsername, updatePassword } = this;
        const { username, password, redirectToHome }  = state
        if(redirectToHome) {
            return (<Redirect to="/home"/>)
        }
        return (
            <div className="container-main">
                <h1 className="h1-title">ToDo App Login</h1>
                <div>
                    <h3>UserName</h3>
                    <input value={username} onChange={e => updateUsername(e)} placeholder="username" type="text"></input>
                    <h3>Password</h3>
                    <input placeholder="password" value={password} onChange={e => updatePassword(e)} type="password"></input>
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

    loginAttempt = () => {
        const { username, password } = this.state;
        if(!username || !password) return
        const requestBody: PostUser = {
            username,
            password
        }
        requestLoginUser(requestBody)
            .then(res => {
                console.log(res)
                sessionStorage.setItem('todoAppToken', res.data.data.token)
                this.setState({
                    redirectToHome: true
                })
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export default LoginPage;