import * as apiClient from "../api-client";
import store from "../stores";

export function getUsers() {
    return apiClient.request('get', '/users');
}

export function getUser(username) {
    return apiClient.request('get', `/users/${username}`);
}

export function updateUser(username, body) {
    return apiClient.request('put', `/users/${username}`, {body})
        .then(user => {
            const oldUser = JSON.parse(localStorage.getItem('user'));
            user.token = oldUser.token;

            localStorage.setItem('user', JSON.stringify(user));
            store.state.auth.user = user;
            return user;
        });
}

export function deleteUser(username) {
    return apiClient.request('delete', `/users/${username}`);
}