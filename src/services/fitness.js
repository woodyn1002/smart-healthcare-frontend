import * as apiClient from "@/api-client";

function resolveInvalidExercises(fitness) {
    if (!fitness.exercise) {
        fitness.exercise = {id: fitness.exerciseId, name: '존재하지 않는 운동', met: 0};
    }
    return fitness;
}

export function getFitnessList(userId, params) {
    return apiClient.request('get', `/users/${userId}/fitness`, {params})
        .then(fitnessList => {
            for (let fitness of fitnessList) {
                resolveInvalidExercises(fitness);
            }
            return fitnessList;
        });
}

export function getFitness(userId, date) {
    return apiClient.request('get', `/users/${userId}/fitness/${date}`)
        .then(fitness => resolveInvalidExercises(fitness));
}

export function createFitness(userId, date, body) {
    return apiClient.request('post', `/users/${userId}/fitness/${date}`, {body})
        .then(fitness => resolveInvalidExercises(fitness));
}

export function updateFitness(userId, date, body) {
    return apiClient.request('put', `/users/${userId}/fitness/${date}`, {body})
        .then(fitness => resolveInvalidExercises(fitness));
}

export function deleteFitness(userId, date) {
    return apiClient.request('delete', `/users/${userId}/fitness/${date}`);
}