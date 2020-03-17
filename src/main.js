import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import store from './stores';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import {localize} from 'vee-validate';
import ko from './assets/vee-validate-ko';

import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

localize({ko});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
