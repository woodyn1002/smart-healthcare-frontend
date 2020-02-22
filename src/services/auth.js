import axios from "axios";
import qs from "qs";

const API_URL = 'http://localhost:3000/v1';

class AuthService {
    authHeader() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            return {Authorization: 'Bearer ' + user.token};
        } else {
            return {};
        }
    }

    register(user) {
        const body = {
            username: user.username,
            password: user.password,
            email: user.email
        };
        return axios.post(API_URL + '/auth/register', qs.stringify(body))
            .then(response => Promise.resolve(response.data))
            .catch(error => Promise.reject(error.response.data));
    }

    login(user) {
        const body = {
            username: user.username,
            password: user.password
        };
        return axios.post(API_URL + '/auth/login', qs.stringify(body))
            .then(response => {
                localStorage.setItem('user', JSON.stringify(response.data));
                return Promise.resolve(response.data);
            })
            .catch(err => Promise.reject(err.response.data));
    }

    logout() {
        localStorage.removeItem('user');
    }
}

export default new AuthService();