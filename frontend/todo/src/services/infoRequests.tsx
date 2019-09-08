import axios from 'axios';

const baseServerURL = "http://localhost:8000/info/"

export const requestAuthenticateSession = (token: string) => {
    return axios.post(baseServerURL + "auth", {token})
}