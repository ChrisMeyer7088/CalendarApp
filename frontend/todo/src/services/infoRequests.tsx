import axios from 'axios';
import { Notice } from '../interfaces/requests'

const baseServerURL = "http://localhost:8000/info/"

export const getUserNotices = (token: string, currentDate: Date) => {
    axios.defaults.headers.common['Authorization'] = token;
    return axios.get(baseServerURL + `notices?date=${currentDate.toLocaleDateString()}`)
}

export const postNotice = (token: string, notice: Notice) => {
    axios.defaults.headers.common['Authorization'] = token
    return axios.post(baseServerURL + "notice", {notice})
}

export const getAccountInfo = (token: string) => {
    axios.defaults.headers.common['Authorization'] = token
    return axios.get(baseServerURL + 'account')
}

export const deleteAccount = (token: string) => {
    axios.defaults.headers.common['Authorization'] = token
    return axios.delete(baseServerURL + 'account')
}