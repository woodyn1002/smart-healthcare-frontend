import * as apiClient from "../api-client";

export function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {'x-access-token': user.token};
    } else {
        return {};
    }
}

export function register(body) {
    return apiClient.request('post', '/auth/register', {body});
}

export function login(body) {
    return apiClient.request('post', '/auth/login', {body})
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

export function logout() {
    localStorage.removeItem('user');
}