import * as apiClient from "@/api-client";

function resolveEmptyObjects(healthData) {
    if (!healthData.date) healthData.date = {};
    if (!healthData.bloodPressure) healthData.bloodPressure = {};
    return healthData;
}

export function getHealthData(userId) {
    return apiClient.request('get', `/users/${userId}/health-data`)
        .then(healthData => resolveEmptyObjects(healthData));
}

export function createOrUpdateHealthData(userId, body) {
    return apiClient.request('get', `/users/${userId}/health-data`)
        .then(() => {
            return apiClient.request('put', `/users/${userId}/health-data`, {body});
        })
        .catch(err => {
            if (err.name === 'HealthDataNotFoundError') {
                return apiClient.request('post', `/users/${userId}/health-data`, {body});
            } else {
                throw err;
            }
        })
        .then(healthData => resolveEmptyObjects(healthData));
}

export function deleteHealthData(userId) {
    return apiClient.request('delete', `/users/${userId}/health-data`);
}