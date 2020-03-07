import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import Health from "../components/Health";
import Meals from "../components/Meals";

Vue.use(Router);

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
            component: Dashboard
        },
        {
            path: '/health',
            component: Health
        },
        {
            path: '/meals',
            component: Meals
        }
    ]
});