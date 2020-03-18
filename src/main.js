import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import store from './stores';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import vueHeadful from 'vue-headful';
import {localize} from 'vee-validate';
import ko from './assets/vee-validate-ko';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.component('vue-headful', vueHeadful);

Vue.config.productionTip = false;

localize({ko});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
