import axios from "axios";
import store from "./stores";
import router from "./routes";
import {authHeader} from "@/services/auth";

const API_URL = process.env.VUE_APP_BACKEND_URL;

axios.interceptors.response.use(
    response => {
        return response;
    }, async error => {
        if (!error.response || error.response.status !== 401)
            return Promise.reject(error);

        if (error.response.data.error.name === 'TokenExpiredError') {
            await store.dispatch('auth/logout');

            if (router.currentRoute.name !== 'login') {
                await router.push('/login');
            }
        }
        return Promise.reject(error);
    });

export function request(method, path, options) {
    let config = {
        method: method,
        url: API_URL + path,
        headers: authHeader()
    };
    if (options) {
        if (options.params) config.params = options.params;
        if (options.body) config.data = options.body;
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