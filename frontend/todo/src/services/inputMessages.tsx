import { ValidityMessage } from '../interfaces/auth'

export const getInputClassAndMessage = (data: ValidityMessage, fieldIsSelected: boolean) => {
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

export const usernameCheck = (usernameExists: boolean, username: string): ValidityMessage => {
    if(usernameExists) return {validity: false, message: "Username Already Exists"};
    if(username.length === 0) return {validity: false, message: "Username Cannot be Blank"};
    return {validity: true, message: "Username Is Allowed"};
}

//Gives password message and wether password is valid
export const passwordCheck = (password: string, cpassword: string): ValidityMessage => {
    if(password.length < 8) return {validity: false, message: "Password must be a minimum of 8 characters"}
    if(!(/\d/.test(password) && /[A-Z]/.test(password))) return {validity: false, 
        message: "Password must contain at least 1 number and 1 uppercase character"}
    if(password !== cpassword) return {validity: false, message: "Passwords must match"}
    return {validity: true, message: "Valid Password"}
}

export const emailCheck = (emailExists: boolean, email: string): ValidityMessage => {
    if(email.length === 0) return {validity: false, message: "Email cannot be blank"}
    if(!email.includes('@') || !email.includes('.com')) return {validity: false, message: "Must be a valid email"}
    if(emailExists) return {validity: false, message: "Email already exists"}
    return {validity: true, message: "Valid Email"}
}

export const checkEnterKey = (e: any, enterFunction: any) => {
    if(e.key === "Enter") {
        enterFunction();
    }
}