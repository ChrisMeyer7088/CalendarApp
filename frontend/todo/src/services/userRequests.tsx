import axios from 'axios';
import { PostUser } from '../interfaces/requests';

const baseServerURL = "http://localhost:8000/user/"

export const requestRegisterUser = (requestBody: PostUser) => {
    return axios.post(baseServerURL + "register", requestBody);
}

export const requestLoginUser = (requestBody: PostUser) => {
    return axios.post(baseServerURL + "login", requestBody);
}

export const requestCheckUsername = (username: string) => {
    return axios.post(baseServerURL + 'user', {username});
}

export const requestResetPassword = (email: string) => {
    return axios.post(baseServerURL + 'password-reset', {email})
}