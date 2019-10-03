import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './register.css';
import { RegisterUser } from '../../interfaces/requests';
import { requestRegisterUser, requestCheckUsername } from '../../services/userRequests';

interface State {
    username: string,
    password: string,
    cpassword: string,
    email: string,
    usernameExists: boolean,
    emailExists: boolean,
    emailHasBeenSelected: boolean,
    passwordFieldHasBeenSelected: boolean,
    usernameFiedlHasBeenSelected: boolean,
    redirectToLogin: boolean   
}

interface ValidityMessage {
    validity:boolean, 
    message: string
}

class RegistrationPage extends React.Component<null, State> {
constructor(props: any) {
    super(props);

    this.state = {
        username: "",
        password: "",
        cpassword: "",
        email: "",
        usernameExists: false,
        passwordFieldHasBeenSelected: false,
        usernameFiedlHasBeenSelected: false,
        redirectToLogin: false,
        emailExists: false,
        emailHasBeenSelected: false
    }
}

    render() {
        const { updateConfirmPassword, updateUsername, updatePassword, registerUser, passwordCheck, usernameCheck,
            checkEnterKey, updateEmail, getInputClassAndMessage, emailCheck } = this;
        const { username, cpassword, password, redirectToLogin, usernameFiedlHasBeenSelected, 
            passwordFieldHasBeenSelected, email, emailHasBeenSelected } = this.state;
        

        let userInputInfo = getInputClassAndMessage(usernameCheck(), usernameFiedlHasBeenSelected);
        let passwordInputInfo = getInputClassAndMessage(passwordCheck(), passwordFieldHasBeenSelected);
        let emailInputInfo = getInputClassAndMessage(emailCheck(), emailHasBeenSelected);

        let enableRegistration: boolean = (userInputInfo.message === "&#x2713" && 
        "&#x2713" === passwordInputInfo.message && "&#x2713" === emailInputInfo.message);
        
        if(redirectToLogin) return (<Redirect to="/login"/>)

         return (
            <div className="container-main">
                <div className="registration-form">
                    <div className="container-login-data">
                        <h1 className="login-header">Create Account:</h1>
                        <div>
                            <div className="container-input">
                                <input placeholder="Username" value={username} onChange={e => updateUsername(e)} type="text"
                                className={userInputInfo.inputFieldClass}></input>
                                <div hidden={userInputInfo.message?false: true} className={userInputInfo.messageClass}>
                                    <p className="message-text" dangerouslySetInnerHTML={{ __html: userInputInfo.message}}></p>
                                </div>
                            </div>
                            <div className="container-input">
                                <input placeholder="Email" value={email} onChange={e => updateEmail(e)} type="text"
                                className={emailInputInfo.inputFieldClass}></input>
                                <div hidden={emailInputInfo.message?false: true} className={emailInputInfo.messageClass}>
                                    <p className="message-text" dangerouslySetInnerHTML={{ __html: emailInputInfo.message}}></p>
                                </div>
                            </div>
                            <div className="container-input">
                                <input placeholder="Password" value={password} onChange={e => updatePassword(e)} type="password"
                                className={passwordInputInfo.inputFieldClass}></input>
                                <div hidden={passwordInputInfo.message?false: true} className={passwordInputInfo.messageClass}>
                                    <p className="message-text" dangerouslySetInnerHTML={{ __html: passwordInputInfo.message}}></p>
                                </div>
                            </div>
                            <div className="container-input">
                                <input placeholder="Confirm Password" value={cpassword} onChange={e => updateConfirmPassword(e)} 
                                type="password" onKeyPress={e => checkEnterKey(e)} className="input-field"></input>
                            </div>
                        </div>
                        <button disabled={!enableRegistration} onClick={() => registerUser()} className="button-submit" >Register</button>
                        <p>Already have an account? <Link to="/login">Login!</Link></p>
                    </div>
                </div>
            </div>
        )
    }

    updateUsername = (event: any) => {
        //Set immediately so page is still responsive even if axios request takes a while
        this.setState({
            username: event.target.value,
            usernameExists: false,
            usernameFiedlHasBeenSelected: true
        })
        //If new username isn't empty check for available username
        if(event.target.value){
            requestCheckUsername(event.target.value)
            .then(res => {
                this.setState({
                    usernameExists: res.data.data.userExists
                }) 
            })
            .catch(err => console.error(err))
        }
    }

    updateEmail = (event: any) => {
        this.setState({
            email: event.target.value,
            emailHasBeenSelected: true
        })
    }

    //Updates password and corresponding state
    updatePassword = (event: any) => {
        this.setState({
            password: event.target.value,
            passwordFieldHasBeenSelected: true
        })
    }

    //Updates confirm password and corresponding state
    updateConfirmPassword = (event: any) => {
        this.setState({
            cpassword: event.target.value
        })
    }

    usernameCheck = (): ValidityMessage => {
        const {usernameExists, username } = this.state;
        if(usernameExists) return {validity: false, message: "Username Already Exists"};
        if(username.length === 0) return {validity: false, message: "Username Cannot be Blank"};
        return {validity: true, message: "Username Is Allowed"};
    }

    //Gives password message and wether password is valid
    passwordCheck = (): ValidityMessage => {
        const { password, cpassword} = this.state
        if(password.length < 8) return {validity: false, message: "Password must be a minimum of 8 characters"}
        if(!(/\d/.test(password) && /[A-Z]/.test(password))) return {validity: false, 
            message: "Password must contain at least 1 number and 1 uppercase character"}
        if(password !== cpassword) return {validity: false, message: "Passwords must match"}
        return {validity: true, message: "Valid Password"}
    }

    emailCheck = (): ValidityMessage => {
        const { emailExists, email } = this.state;
        if(email.length === 0) return {validity: false, message: "Email cannot be blank"}
        if(!email.includes('@') || !email.includes('.com')) return {validity: false, message: "Must be a valid email"}
        if(emailExists) return {validity: false, message: "Email already exists"}
        return {validity: true, message: "Valid Email"}
    }

    //Sends a registration request to the server of the user
    registerUser = () => {
        const requestBody: RegisterUser = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }

        requestRegisterUser(requestBody)
            .then(res => {
                this.setState({
                    username: "",
                    password: "",
                    cpassword: "",
                    email: "",
                    redirectToLogin: true
                })
            })
            .catch(err => console.error(err))
    }

    checkEnterKey = (e: any) => {
        if(e.key === "Enter") {
            this.registerUser();
        }
    }

    private getInputClassAndMessage = (data: ValidityMessage, fieldIsSelected: boolean) => {
        let inputFieldClass = '';
        let messageClass = '';
        let message= '';
        if(!fieldIsSelected) inputFieldClass = "input-field"
        else {
            message = data.message;
            if(data.validity) {
                message = "&#x2713"
                inputFieldClass = "input-field valid-field"
                messageClass = "ok-message"
            }
            else {
                inputFieldClass = "input-field invalid-field"
                messageClass = "error-message"
            }
        }
        return {
            inputFieldClass,
            messageClass,
            message
        }
    }

}

export default RegistrationPage;