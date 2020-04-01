import * as apiClient from "@/api-client";

function resolveInvalidFoods(meal) {
    for (let dish of meal.dishes) {
        if (!dish.food) {
            dish.food = {id: dish.foodId, name: '존재하지 않는 음식', calories: 0};
        }
    }
    return meal;
}

export function getMeals(userId, params) {
    return apiClient.request('get', `/users/${userId}/meals`, {params})
        .then(meals => {
            for (let meal of meals) {
                resolveInvalidFoods(meal);
            }
            return meals;
        });
}

export function getMeal(userId, date) {
    return apiClient.request('get', `/users/${userId}/meals/${date}`)
        .then(meal => resolveInvalidFoods(meal));
}

export function createMeal(userId, date, body) {
    return apiClient.request('post', `/users/${userId}/meals/${date}`, {body})
        .then(meal => resolveInvalidFoods(meal));
}

export function updateMeal(userId, date, body) {
    return apiClient.request('put', `/users/${userId}/meals/${date}`, {body})
        .then(meal => resolveInvalidFoods(meal));
}

export function deleteMeal(userId, date) {
    return apiClient.request('delete', `/users/${userId}/meals/${date}`);
}