import * as apiClient from "@/api-client";

function resolveInvalidFoods(meal) {
    for (let dish of meal.dishes) {
        if (!dish.food) {
            dish.food = {id: dish.foodId, name: '존재하지 않는 음식', calories: 0};
        }
    }
    return meal;
}

export function getMeals(username) {
    return apiClient.request('get', `/users/${username}/meals`)
        .then(meals => {
            for (let meal of meals) {
                resolveInvalidFoods(meal);
            }
            return meals;
        });
}

export function getMeal(username, date) {
    return apiClient.request('get', `/users/${username}/meals/${date}`)
        .then(meal => resolveInvalidFoods(meal));
}

export function createMeal(username, date, body) {
    return apiClient.request('post', `/users/${username}/meals/${date}`, body)
        .then(meal => resolveInvalidFoods(meal));
}

export function updateMeal(username, date, body) {
    return apiClient.request('put', `/users/${username}/meals/${date}`, body)
        .then(meal => resolveInvalidFoods(meal));
}

export function deleteMeal(username, date) {
    return apiClient.request('delete', `/users/${username}/meals/${date}`);
}