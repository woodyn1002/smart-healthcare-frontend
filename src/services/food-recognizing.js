import * as apiClient from "@/api-client";

export function recognize(body) {
    return apiClient.request('post', `/ai/food-recognizing`, {
        body,
        headers: {'Content-Type': 'multipart/form-data'}
    });
}