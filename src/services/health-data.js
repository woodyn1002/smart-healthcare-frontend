import * as apiClient from "@/api-client";

export function getHealthDataList(userId, params) {
    return apiClient.request('get', `/users/${userId}/health-data`, {params});
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

            return healthData;
        });
}

export function getHealthData(userId, date) {
    return apiClient.request('get', `/users/${userId}/health-data/${date}`);
}

export function createHealthData(userId, date, body) {
    return apiClient.request('post', `/users/${userId}/health-data/${date}`, {body});
}

export function updateHealthData(userId, date, body) {
    return apiClient.request('put', `/users/${userId}/health-data/${date}`, {body});
}

export function deleteHealthData(userId, date) {
    return apiClient.request('delete', `/users/${userId}/health-data/${date}`);
}