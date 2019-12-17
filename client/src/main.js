import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import CountryFlag from 'vue-country-flag';

Vue.prototype.$http = Axios;
Vue.component('country-flag', CountryFlag)

const token = localStorage.getItem('user-token')
if (token) {
  Vue.prototype.$http.defaults.headers.common["x-auth-token"] = token
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
