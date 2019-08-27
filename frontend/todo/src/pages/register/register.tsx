import React from 'react';
import { Link } from 'react-router-dom';
import './register.css';

interface State {
    username: string,
    password: string,
    cpassword: string,
    canRegister: boolean,
    passwordIsMinLength: boolean,
    passwordsMatch: boolean,
    passwordsHaveCorrectCharacters: boolean,
    registrationClicked: boolean
}

class RegistrationPage extends React.Component<null, State> {
constructor(props: any) {
    super(props);

    this.state = {
        username: "",
        password: "",
        cpassword: "",
        canRegister: false,
        passwordIsMinLength: false,
        passwordsMatch: false,
        passwordsHaveCorrectCharacters: false,
        registrationClicked: false
    }
}

    render() {
        const { updateConfirmPassword, updateUsername, updatePassword, registerUser, renderPasswordReq } = this;
        const { username, cpassword, password, registrationClicked } = this.state;
         return (
            <div>
                <h1 className="h1-title">Register</h1>
                <div id="RegistrationForm">
                    <h3>Username</h3>
                    <input placeholder="username" value={username} onChange={e => updateUsername(e)} type="text"></input>
                    <h3>Password</h3>
                    <input placeholder="password" value={password} onChange={e => updatePassword(e)} type="password"></input>
                    <div hidden={!registrationClicked}>
                        {renderPasswordReq()}
                    </div>
                    <h3>Confirm Password</h3>
                    <input placeholder="confirm password" value={cpassword} onChange={e => updateConfirmPassword(e)} type="password"></input>
                </div>
                <button onClick={() => registerUser()} className="button-submit" >Create</button>
                <p>Already have an account? <Link to="/login">Login!</Link></p>
            </div>
        )
    }

    renderPasswordReq = () => {
        const {passwordIsMinLength, passwordsMatch, passwordsHaveCorrectCharacters} = this.state
        if(!passwordIsMinLength) return (<p>Password must be a minimum of eight (8) characters in length</p>)
        if(!passwordsHaveCorrectCharacters) return (<p>Password must contain at least 1 number and 1 uppercase character</p>)
        if(!passwordsMatch) return (<p>Passwords must match</p>)
    }

    updateUsername = (event: any) => {
        this.setState({
            username: event.target.value
        })
    }

    updatePassword = (event: any) => {
        let passwordUpdate: string = event.target.value;
        this.setState({
            password: passwordUpdate
        })
    }

    updateConfirmPassword = (event: any) => {
        this.setState({
            cpassword: event.target.value
        })
    }

    registerUser = () => {
        this.setState({
            registrationClicked: true
        })
        if(this.validPasswordReq()) {
            
        }
    }

    validPasswordReq = (): boolean => {
        if(this.state.password.length < 8) {
            this.setState({
                passwordIsMinLength: false
            })
            return false;
        } else {
            this.setState({
                passwordIsMinLength: true
            })
        }
        if(!(/\d/.test(this.state.password) && /[A-Z]/.test(this.state.password))) {
            this.setState({
                passwordsHaveCorrectCharacters: false
            })
            return false;
        } else {
            this.setState({
                passwordsHaveCorrectCharacters: true
            })
        }
        if(this.state.cpassword !== this.state.password) {
            this.setState({
                passwordsMatch: false
            })
            return false;
        } else {
            this.setState({
                passwordsMatch: true
            })
        }
        return true;
    }
}

export default RegistrationPage;