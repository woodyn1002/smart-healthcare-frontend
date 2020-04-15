import * as AuthService from "../services/auth";

function initialState() {
    let state = {
        csrfToken: null,
        status: {},
        user: null
    };

    let csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) state.csrfToken = csrfToken;

    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        state.status = {loggedIn: true};
        state.user = user;
    }

    return state;
}

export const auth = {
    namespaced: true,
    state: initialState(),
    actions: {
        makeCsrfToken({commit}) {
            let token = AuthService.makeCsrfToken();
            commit('csrfTokenPublished', token);
            return Promise.resolve(token);
        },
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
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        loginWithNaver({commit}, body) {
            return AuthService.loginWithNaver(body).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        loginWithFacebook({commit}, body) {
            return AuthService.loginWithFacebook(body).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        logout({commit}) {
            AuthService.logout();
            commit('logout');
        }
    },
    mutations: {
        csrfTokenPublished(state, token) {
            state.csrfToken = token;
        },
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
        csrfToken(state) {
            return state.csrfToken;
        },
        loggedIn(state) {
            return state.status.loggedIn;
        },
        currentUser(state) {
            return state.user;
        }
    }
};