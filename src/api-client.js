import axios from "axios";
import qs from "qs";
import {authHeader} from "@/services/auth";

const API_URL = 'http://localhost:3000/v1';

export function request(method, path, body) {
    let config = {
        method: method,
        url: API_URL + path,
        headers: authHeader()
    };
    if (body) {
        config.data = qs.stringify(body);
    }

    return axios(config)
        .then(response => Promise.resolve(response.data))
        .catch(err => {
            if (err.response) {
                return Promise.reject(err.response.data);
            } else {
                console.error(err);
                return Promise.reject(err);
            }
        });
}