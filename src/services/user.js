import * as apiClient from "../api-client";
import store from "../stores";

export function getUsers() {
    return apiClient.request('get', '/users');
}

export function getUser(userId) {
    return apiClient.request('get', `/users/${userId}`);
}

export function updateUser(userId, body) {
    return apiClient.request('put', `/users/${userId}`, {body})
        .then(user => {
            const oldUser = JSON.parse(localStorage.getItem('user'));
            user.token = oldUser.token;

            localStorage.setItem('user', JSON.stringify(user));
            store.state.auth.user = user;
            return user;
        });
}

export function deleteUser(userId) {
    return apiClient.request('delete', `/users/${userId}`);
}