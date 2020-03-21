import axios from "axios";
import {authHeader} from "@/services/auth";

const API_URL = 'http://localhost:3000/v1';

export function request(method, path, body) {
    let config = {
        method: method,
        url: API_URL + path,
        headers: authHeader()
    };
    if (body) {
        config.data = body;
    }

    return axios(config)
        .then(response => Promise.resolve(response.data))
        .catch(err => {
            if (err.response) {
                return Promise.reject(err.response.data.error);
            } else {
                console.error(err);
                return Promise.reject(err);
            }
        });
}