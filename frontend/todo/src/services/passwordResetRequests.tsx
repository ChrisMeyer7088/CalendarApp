import axios from 'axios';

const baseServerURL = "http://localhost:8000/password-reset/"


export const requestResetPassword = (email: string) => {
    return axios.post(baseServerURL + 'email', {email})
}

export const requestLinkVerification = (linkValue: string) => {
    return axios.post(baseServerURL + 'verify-link', {value: linkValue})
}

export const requestPutPassword = (linkValue: string, newPassword: string) => {
    return axios.put(baseServerURL + 'password', {value: linkValue, password: newPassword})
}