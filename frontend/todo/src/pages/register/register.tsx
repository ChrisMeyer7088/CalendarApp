import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './register.css';
import { PostUser } from '../../interfaces/requests';
import { CheckUser } from '../../interfaces/responses'
import { requestRegisterUser, requestCheckUsername } from '../../services/userRequests';

interface State {
    username: string,
    password: string,
    cpassword: string,
    canRegister: boolean,
    passwordIsMinLength: boolean,
    passwordsMatch: boolean,
    passwordsHaveCorrectCharacters: boolean,
    usernameExists: boolean,
    passwordFieldHasBeenSelected: boolean,
    usernameFiedlHasBeenSelected: boolean,
    usernameIsBlank: boolean,
    redirectToLogin: boolean
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
        usernameExists: false,
        passwordFieldHasBeenSelected: false,
        usernameFiedlHasBeenSelected: false,
        usernameIsBlank: true,
        redirectToLogin: false
    }
}

    render() {
        const { updateConfirmPassword, updateUsername, updatePassword, registerUser, getPasswordReq, usernameCheck,
            checkEnterKey } = this;
        const { username, cpassword, password, canRegister, redirectToLogin, usernameFiedlHasBeenSelected, 
            passwordFieldHasBeenSelected } = this.state;
        

        let usernameInputFieldClass = '';
        let usernameMessageClass = '';
        let usernameMessage: string = '';
        let usernameCheckObj;
        if(!usernameFiedlHasBeenSelected) usernameInputFieldClass = "input-field"
        else {
            usernameCheckObj = usernameCheck();
            usernameMessage = usernameCheckObj.message;
            if(usernameCheckObj.validity) {
                usernameMessage = "&#x2713"
                usernameInputFieldClass = "input-field valid-field"
                usernameMessageClass = "ok-message"
            }
            else {
                usernameInputFieldClass = "input-field invalid-field"
                usernameMessageClass = "error-message"
            }
        }

        let passwordInputFieldClass = '';
        let passwordMessageClass = '';
        let passwordMessage: string = '';
        let passwordCheckObj
        if(!passwordFieldHasBeenSelected) passwordInputFieldClass = "input-field"
        else {
            passwordCheckObj = getPasswordReq();
            passwordMessage = passwordCheckObj.message;
            if(passwordCheckObj.validity) {
                passwordMessage = "&#x2713"
                passwordInputFieldClass = "input-field valid-field"
                passwordMessageClass = "ok-message"
            }
            else {
                passwordInputFieldClass = "input-field invalid-field"
                passwordMessageClass = "error-message"
            }
        }

        if(redirectToLogin) return (<Redirect to="/login"/>)

         return (
            <div className="container-main">
                <div className="registration-form">
                    <div className="container-login-data">
                        <h1 className="login-header">Create Account:</h1>
                        <div>
                            <div className="container-input">
                                <input placeholder="Username" value={username} onChange={e => updateUsername(e)} type="text"
                                className={usernameInputFieldClass}></input>
                                <div hidden={usernameCheckObj?false: true} className={usernameMessageClass}>
                                    <p className="message-text" dangerouslySetInnerHTML={{ __html: usernameMessage}}></p>
                                </div>
                            </div>
                            <div className="container-input">
                                <input placeholder="Password" value={password} onChange={e => updatePassword(e)} type="password"
                                className={passwordInputFieldClass}></input>
                                <div hidden={passwordCheckObj?false: true} className={passwordMessageClass}>
                                    <p className="message-text" dangerouslySetInnerHTML={{ __html: passwordMessage}}></p>
                                </div>
                            </div>
                            <div className="container-input">
                                <input placeholder="Confirm Password" value={cpassword} onChange={e => updateConfirmPassword(e)} 
                                type="password" onKeyPress={e => checkEnterKey(e)} className="input-field"></input>
                            </div>
                        </div>
                        <button disabled={!canRegister} onClick={() => registerUser()} className="button-submit" >Register</button>
                        <p>Already have an account? <Link to="/login">Login!</Link></p>
                    </div>
                </div>
            </div>
        )
    }

    //Renders password requirement tag
    getPasswordReq = (): {validity: boolean, message: string} => {
        const {passwordIsMinLength, passwordsMatch, passwordsHaveCorrectCharacters} = this.state
        if(!passwordIsMinLength) return {validity: false, message: "Password must be a minimum of 8 characters"}
        if(!passwordsHaveCorrectCharacters) return {validity: false, 
            message: "Password must contain at least 1 number and 1 uppercase character"}
        if(!passwordsMatch) return {validity: false, message: "Passwords must match"}
        return {validity: true, message: "Valid Password"}
    }

    updateUsername = (event: any) => {
        //Set immediately so page is still responsive even if axios request takes a while
        this.setState({
            username: event.target.value
        })
        //If new username isn't empty check for available username
        if(event.target.value){
            requestCheckUsername(event.target.value)
            .then(res => {
                this.checkUsername(res.data)
            })
            .catch(err => console.error(err))
        } else {
            this.setState({
                usernameIsBlank: true,
                usernameExists: false,
                usernameFiedlHasBeenSelected: true,
                canRegister: false
            })
        }
    }

    //Checks for the validity of the username and updates corresponding state
    checkUsername = (checkUser: CheckUser) => {
        const { passwordIsMinLength, passwordsHaveCorrectCharacters, passwordsMatch} = this.state;
        let canRegister = false;
        if(!checkUser.data.userExists && passwordIsMinLength && passwordsHaveCorrectCharacters && passwordsMatch) canRegister = true;
        this.setState({
            usernameExists: checkUser.data.userExists,
            usernameIsBlank: false,
            usernameFiedlHasBeenSelected: true,
            canRegister
        })
    }

    usernameCheck = (): {validity:boolean, message: string} => {
        const {usernameExists, usernameIsBlank} = this.state;
        if(usernameExists) return {validity: false, message: "Username Already Exists"};
        if(usernameIsBlank) return {validity: false, message: "Username Cannot be Blank"};
        return {validity: true, message: "Username Is Allowed"};
    }

    //Updates password and corresponding state
    updatePassword = (event: any) => {
        this.passwordViewUpdate(event.target.value, this.state.cpassword);
    }

    //Updates confirm password and corresponding state
    updateConfirmPassword = (event: any) => {
        this.passwordViewUpdate(this.state.password, event.target.value);
    }

    passwordViewUpdate = (password: string, cpassword: string) => {
        const { validPasswordReq } = this;
        const { usernameExists, usernameIsBlank} = this.state;
        //Determines if all fields are ready for registration
        let canRegister = false;
        if(validPasswordReq(password, cpassword) && !usernameExists && !usernameIsBlank)  canRegister = true;
        
        this.setState({
            password,
            cpassword,
            passwordFieldHasBeenSelected: true,
            canRegister
        })
    }

    //Checks the password and confirm password field and returns a boolean based on the validity of the fields
    validPasswordReq = (password: string, cpassword: string): boolean => {
        if(password.length < 8) {
            this.setState({
                passwordIsMinLength: false
            })
            return false;
        } else {
            this.setState({
                passwordIsMinLength: true
            })
        }
        if(!(/\d/.test(password) && /[A-Z]/.test(password))) {
            this.setState({
                passwordsHaveCorrectCharacters: false
            })
            return false;
        } else {
            this.setState({
                passwordsHaveCorrectCharacters: true
            })
        }
        if(cpassword !== password) {
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

    //Sends a registration request to the server of the user
    registerUser = () => {
        const requestBody: PostUser = {
            username: this.state.username,
            password: this.state.password
        }

        requestRegisterUser(requestBody)
            .then(res => {
                this.setState({
                    username: "",
                    password: "",
                    cpassword: "",
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
}

export default RegistrationPage;