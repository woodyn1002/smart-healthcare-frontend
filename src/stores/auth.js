import AuthService from "../services/auth";

const user = JSON.parse(localStorage.getItem('user'));
const initialState = (user) ? {status: {loggedIn: true}, user} : {status: {}, user: null};

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        register({commit}, user) {
            return AuthService.register(user).then(
                user => {
                    commit('registerSuccess');
                    return Promise.resolve(user);
                },
                error => {
                    commit('registerFailure');
                    return Promise.reject(error);
                }
            );
        },
        login({commit}, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);
                    return user;
                },
                error => {
                    commit('loginFailure');
                    return error;
                }
            );
        },
        logout({commit}) {
            AuthService.logout();
            commit('logout');
        }
    },
    mutations: {
        registerSuccess(state) {
            state.status = {};
        },
        registerFailure(state) {
            state.status = {};
        },
        loginSuccess(state, user) {
            state.status = {loggedIn: true};
            state.user = user;
        },
        loginFailure(state) {
            state.status = {};
            state.user = null;
        },
        logout(state) {
            state.status = {};
            state.user = null;
        }
    },
    getters: {
        loggedIn(state) {
            return state.status.loggedIn;
        },
        currentUser(state) {
            return state.user;
        }
    }
};