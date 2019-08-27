import axios from 'axios';

const baseServerURL = "http://localhost:3200/"

export default axios.create({
    baseURL: baseServerURL + "user/create",
    responseType: "json"
})