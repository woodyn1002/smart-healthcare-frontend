import {v4 as uuidv4} from "uuid";
import * as apiClient from "../api-client";

export function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {'x-access-token': user.token};
    } else {
        return {};
    }
}

export function makeCsrfToken() {
    let token = uuidv4();
    localStorage.setItem('csrfToken', token);
    return token;
}

export function register(body) {
    return apiClient.request('post', '/auth/register', {body});
}

const saveAndReturnUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
};

export function login(body) {
    return apiClient.request('post', '/auth/login', {body})
        .then(user => saveAndReturnUser(user));
}

export function loginWithNaver(body) {
    return apiClient.request('post', '/auth/naver', {body})
        .then(user => saveAndReturnUser(user));
}

export function loginWithFacebook(body) {
    return apiClient.request('post', '/auth/facebook', {body})
        .then(user => saveAndReturnUser(user));
}

export function logout() {
    localStorage.removeItem('user');
}