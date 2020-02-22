import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import store from './stores';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {ValidationProvider} from 'vee-validate';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
    components: {
        ValidationProvider
    }
}).$mount('#app');