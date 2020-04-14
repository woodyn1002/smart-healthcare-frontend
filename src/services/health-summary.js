import * as apiClient from "@/api-client";

export function getHealthSummary(userId, year, month) {
    return apiClient.request('get', `/users/${userId}/health-summary/${year}/${month}`);
}