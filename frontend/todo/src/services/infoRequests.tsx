import axios from 'axios';
import { Notice } from '../interfaces/requests'

const baseServerURL = "http://localhost:8000/info/"

export const getUserNotices = (token: string) => {
    axios.defaults.headers.common['Authorization'] = token
    return axios.get(baseServerURL + "notices")
}

export const postNotice = (token: string, notice: Notice) => {
    axios.defaults.headers.common['Authorization'] = token
    return axios.post(baseServerURL + "notice", {notice})
}

export const getAccountInfo = (token: string) => {
    axios.defaults.headers.common['Authorization'] = token
    return axios.get(baseServerURL + 'account')
}