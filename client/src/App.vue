<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item v-if="isLoggedIn">
          <span class="font-weight-black"
            >{{ $t("appWelcomeText") }}, {{ user.name }}</span
          >
        </v-list-item>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>{{ $t("navHome") }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isLoggedIn" to="/settings">
          <v-list-item-icon>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-icon>

          <v-list-item-title>{{ $t("navSettings") }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isLoggedIn" to="/login">
          <v-list-item-icon>
            <v-icon>mdi-account-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("navLogin") }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!isLoggedIn" to="/register">
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("navRegister") }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-else @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("navLogout") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      fixed
      dark
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Event Calendar</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list v-if="isLoggedIn">
            <v-list-item>
              <v-list-item-avatar color="primary" size="48">
                <span class="white--text headline">{{ userAvatar }}</span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ user.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-btn
                  v-for="entry in languages"
                  :key="entry.title"
                  @click="changeLocale(entry.language)"
                  text
                >
                  <flag :iso="entry.flag" v-bind:squared="false" />
                  <v-list-item-title>{{ entry.title }}</v-list-item-title>
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="menu = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import i18n from "@/plugins/i18n";
import api from "./api";

export default {
  data() {
    return {
      drawer: null,
      languages: [
        { flag: "us", language: "en", title: "English" },
        { flag: "pl", language: "pl", title: "Polski" }
      ]
    };
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },

    user() {
      return this.$store.state.user;
    },

    lang() {
      return this.$store.getters.lang;
    },

    userAvatar() {
      if (!this.user.name) {
        return "";
      }

      return this.user.name
        .split(" ")
        .slice(0, 2)
        .map(el => el[0])
        .join("");
    }
  },
  watch: {
    lang: function(locale) {
      i18n.locale = locale;
      this.$vuetify.lang.current = locale;
    },
    user: {
      deep: true,
      handler(edited) {
        this.$vuetify.theme.dark = edited.settings
          ? edited.settings.layout.dark
          : false;
      }
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },

    async changeLocale(locale) {
      if (this.isLoggedIn) {
        await api.updateLanguage({ lang: locale });
        this.$store.dispatch("getUserData");
      } else {
        i18n.locale = locale;
        this.$vuetify.lang.current = locale;
      }
    }
  },
  created() {
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout);
        }
        throw err;
      });
    });

    if (
      this.$store.state.token &&
      Object.entries(this.$store.state.user).length === 0
    ) {
      this.$store.dispatch("getUserData");
    }
  }
};
</script>