import * as apiClient from "@/api-client";

export function getFoods() {
    return apiClient.request('get', '/foods');
}

export function getFood(foodId) {
    return apiClient.request('get', `/foods/${foodId}`);
}

export function createFood(body) {
    return apiClient.request('put', '/foods', body);
}

export function updateFood(foodId, body) {
    return apiClient.request('put', `/foods/${foodId}`, body);
}

export function deleteFood(foodId) {
    return apiClient.request('delete', `/foods/${foodId}`);
}