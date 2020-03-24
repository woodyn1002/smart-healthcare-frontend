import * as apiClient from "@/api-client";

function resolveEmptyObjects(healthData) {
    if (!healthData.date) healthData.date = {};
    if (!healthData.bloodPressure) healthData.bloodPressure = {};
    return healthData;
}

export function getHealthData(username) {
    return apiClient.request('get', `/users/${username}/health-data`)
        .then(healthData => resolveEmptyObjects(healthData));
}

export function createOrUpdateHealthData(username, body) {
    return apiClient.request('get', `/users/${username}/health-data`)
        .then(() => {
            return apiClient.request('put', `/users/${username}/health-data`, {body});
        })
        .catch(err => {
            if (err.name === 'HealthDataNotFoundError') {
                return apiClient.request('post', `/users/${username}/health-data`, {body});
            } else {
                throw err;
            }
        })
        .then(healthData => resolveEmptyObjects(healthData));
}

export function deleteHealthData(username) {
    return apiClient.request('delete', `/users/${username}/health-data`);
}