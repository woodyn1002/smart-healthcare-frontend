import * as apiClient from "@/api-client";

export function getExercises() {
    return apiClient.request('get', '/exercises');
}

export function getExercise(exerciseId) {
    return apiClient.request('get', `/exercises/${exerciseId}`);
}

export function createExercise(body) {
    return apiClient.request('put', '/exercises', {body});
}

export function updateExercise(exerciseId, body) {
    return apiClient.request('put', `/exercises/${exerciseId}`, {body});
}

export function deleteExercise(exerciseId) {
    return apiClient.request('delete', `/exercises/${exerciseId}`);
}