import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './register.css';
import { PostUser } from '../../interfaces/requests';
import { CheckUser } from '../../interfaces/responses'
import { requestRegisterUser, requestCheckUsername } from '../../services/authentication';

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
        const { updateConfirmPassword, updateUsername, updatePassword, registerUser, renderPasswordReq, renderUsernameCheck } = this;
        const { username, cpassword, password, canRegister, redirectToLogin } = this.state;

        if(redirectToLogin) return (<Redirect to="/login"/>)

         return (
            <div>
                <h1 className="h1-title">Register</h1>
                <div id="RegistrationForm">
                    <h3>Username</h3>
                    <input placeholder="username" value={username} onChange={e => updateUsername(e)} type="text"></input>
                    {renderUsernameCheck()}
                    <h3>Password</h3>
                    <input placeholder="password" value={password} onChange={e => updatePassword(e)} type="password"></input>
                    {renderPasswordReq()}
                    <h3>Confirm Password</h3>
                    <input placeholder="confirm password" value={cpassword} onChange={e => updateConfirmPassword(e)} type="password"></input>
                </div>
                <button disabled={!canRegister} onClick={() => registerUser()} className="button-submit" >Create</button>
                <p>Already have an account? <Link to="/login">Login!</Link></p>
            </div>
        )
    }

    //Renders password requirement tag
    renderPasswordReq = () => {
        const {passwordIsMinLength, passwordsMatch, passwordsHaveCorrectCharacters, passwordFieldHasBeenSelected} = this.state
        if(!passwordFieldHasBeenSelected) return
        if(!passwordIsMinLength) return (<p>Password must be a minimum of 8 characters</p>)
        if(!passwordsHaveCorrectCharacters) return (<p>Password must contain at least 1 number and 1 uppercase character</p>)
        if(!passwordsMatch) return (<p>Passwords must match</p>)
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

    //Renders the username availability tag
    renderUsernameCheck = () => {
        const {usernameExists, usernameFiedlHasBeenSelected, usernameIsBlank} = this.state;
        if(!usernameFiedlHasBeenSelected) return
        if(usernameExists) return (<p>Username Already Taken</p>)
        if(usernameIsBlank) return (<p>Username cannot be blank</p>)
        return (<p>Username Available</p>)
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
                console.log(res)
                this.setState({
                    username: "",
                    password: "",
                    cpassword: "",
                    redirectToLogin: true
                })
            })
            .catch(err => console.error(err))
    }
}

export default RegistrationPage;