import axios from 'axios';

const baseServerURL = "http://localhost:8000/info/"

export const requestAuthenticateSession = (token: string) => {
    return axios.post(baseServerURL + "auth", {token})
}

export const requestUserNotices = (token: string, userId: string) => {
    return axios.post(baseServerURL + "notices", {token, userId})
}