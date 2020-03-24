import Vue from "vue";
import Router from "vue-router";
import store from "../stores";
import Home from "../components/Home";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import Health from "../components/Health";
import Meals from "../components/Meals";
import Fitness from "@/components/Fitness";

Vue.use(Router);

const requireAuth = (from, to, next) => {
    if (store.getters['auth/loggedIn'])
        return next();
    else
        next('/login');
};

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/dashboard',
            component: Dashboard,
            beforeEnter: requireAuth
        },
        {
            path: '/health',
            component: Health,
            beforeEnter: requireAuth
        },
        {
            path: '/meals',
            component: Meals,
            beforeEnter: requireAuth
        },
        {
            path: '/fitness',
            component: Fitness,
            beforeEnter: requireAuth
        }
    ]
});