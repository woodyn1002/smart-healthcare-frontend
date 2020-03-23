import * as apiClient from "../api-client";

export function getUsers() {
    return apiClient.request('get', '/users');
}

export function getUser(username) {
    return apiClient.request('get', `/users/${username}`);
}

export function updateUser(username, body) {
    return apiClient.request('put', `/users/${username}`, body);
}

export function deleteUser(username) {
    return apiClient.request('delete', `/users/${username}`);
}