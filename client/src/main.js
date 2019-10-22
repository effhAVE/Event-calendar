import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import FlagIcon from 'vue-flag-icon'
import vueMoment from "vue-moment";

Vue.prototype.$http = Axios;
Vue.use(FlagIcon);

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
  vueMoment,
  render: h => h(App)
}).$mount('#app')
