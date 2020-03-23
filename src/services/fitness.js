import * as apiClient from "@/api-client";

function resolveInvalidExercises(fitness) {
    if (!fitness.exercise) {
        fitness.exercise = {id: fitness.exerciseId, name: '존재하지 않는 운동', met: 0};
    }
    return fitness;
}

export function getFitnessList(username) {
    return apiClient.request('get', `/users/${username}/fitness`)
        .then(fitnessList => {
            for (let fitness of fitnessList) {
                resolveInvalidExercises(fitness);
            }
            return fitnessList;
        });
}

export function getFitness(username, date) {
    return apiClient.request('get', `/users/${username}/fitness/${date}`)
        .then(fitness => resolveInvalidExercises(fitness));
}

export function createFitness(username, date, body) {
    return apiClient.request('post', `/users/${username}/fitness/${date}`, body)
        .then(fitness => resolveInvalidExercises(fitness));
}

export function updateFitness(username, date, body) {
    return apiClient.request('put', `/users/${username}/fitness/${date}`, body)
        .then(fitness => resolveInvalidExercises(fitness));
}

export function deleteFitness(username, date) {
    return apiClient.request('delete', `/users/${username}/fitness/${date}`);
}