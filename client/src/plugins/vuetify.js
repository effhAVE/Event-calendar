import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pl from 'vuetify/es5/locale/pl';
import en from 'vuetify/es5/locale/en';

Vue.use(Vuetify);

export default new Vuetify({
  treeShake: true,
  lang: {
    locales: {
      pl,
      en
    },
    current: 'en',
  },
  icons: {
    iconfont: 'mdi',
  },
});