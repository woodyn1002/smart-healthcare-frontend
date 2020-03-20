import axios from "axios";
import qs from "qs";

const API_URL = 'http://localhost:3000/v1';

export function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {'x-access-token': user.token};
    } else {
        return {};
    }
}

export function register(body) {
    return axios.post(API_URL + '/auth/register', qs.stringify(body))
        .then(response => Promise.resolve(response.data))
        .catch(error => Promise.reject(error.response.data));
}

export function login(body) {
    return axios.post(API_URL + '/auth/login', qs.stringify(body))
        .then(response => {
            localStorage.setItem('user', JSON.stringify(response.data));
            return Promise.resolve(response.data);
        })
        .catch(err => Promise.reject(err.response.data));
}

export function logout() {
    localStorage.removeItem('user');
}