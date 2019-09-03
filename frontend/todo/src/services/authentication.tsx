import axios from 'axios';
import { PostUser } from '../interfaces/requests';

const baseServerURL = "http://localhost:8000/"

export const requestRegisterUser = (requestBody: PostUser) => {
    return axios.post(baseServerURL + "user/register", requestBody);
}

export const requestLoginUser = (requestBody: PostUser) => {
    return axios.post(baseServerURL + "user/login", requestBody);
}

export const requestCheckUsername = (username: string) => {
    return axios.post(baseServerURL + 'user/user', {username});
}

export const requestAuthenticateSession = (token: string) => {
    return axios.post(baseServerURL + "user/auth", {token})
}