import * as apiClient from "@/api-client";

function resolveEmptyObjects(healthData) {
    if (!healthData.date) healthData.date = {};
    if (!healthData.bloodPressure) healthData.bloodPressure = {};
    return healthData;
}

export function getHealthDataList(userId, params) {
    return apiClient.request('get', `/users/${userId}/health-data`, {params})
        .then(healthDataList => {
            healthDataList.forEach(healthData => resolveEmptyObjects(healthData));
            return healthDataList;
        });
}

export function getLatestHealthData(userId) {
    let params = {limit: 1, sortByDatesDesc: true}
    return apiClient.request('get', `/users/${userId}/health-data`, {params})
        .then(healthDataList => {
            let healthData;
            if (healthDataList.length === 0)
                healthData = {};
            else
                healthData = healthDataList[0];

            return resolveEmptyObjects(healthData);
        });
}

export function getHealthData(userId, date) {
    return apiClient.request('get', `/users/${userId}/health-data/${date}`)
        .then(healthData => resolveEmptyObjects(healthData));
}

export function createHealthData(userId, date, body) {
    return apiClient.request('post', `/users/${userId}/health-data/${date}`, {body})
        .then(healthData => resolveEmptyObjects(healthData));
}

export function updateHealthData(userId, date, body) {
    return apiClient.request('put', `/users/${userId}/health-data/${date}`, {body})
        .then(healthData => resolveEmptyObjects(healthData));
}

export function deleteHealthData(userId, date) {
    return apiClient.request('delete', `/users/${userId}/health-data/${date}`);
}