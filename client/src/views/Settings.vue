<template>
  <v-card height="100%" v-if="!loading">
    <v-toolbar flat>
      <v-toolbar-title>{{ $t("navSettings") }}</v-toolbar-title>
    </v-toolbar>

    <v-list subheader three-line>
      <v-list-item-group active-class="">
        <v-subheader>{{ $t("settingsLayoutTitle") }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{
              $t("settingsLayoutThemeTitle")
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              $t("settingsLayoutThemeDesc")
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-select
              :items="themeList"
              v-model="theme"
              style="max-width: 400px"
              filled
              solo
            ></v-select>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="darkMode"
              @change="changeMode"
              color="primary"
              inset
            ></v-switch>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{
              $t("settingsLayoutDarkTitle")
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              $t("settingsLayoutDarkDesc")
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider></v-divider>

    <v-list subheader three-line>
      <v-list-item-group active-class="">
        <v-subheader>{{ $t("settingsCalendarTitle") }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{
              $t("settingsCalendarFirstdayTitle")
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              $t("settingsCalendarFirstdayDesc")
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-select
              :items="weekdays"
              item-text="title"
              item-value="value"
              v-model="selectedFirst"
              style="max-width: 400px"
              filled
              solo
            ></v-select>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import api from "../api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      darkMode: false,
      theme: "",
      themeList: ["primary"],
      weekdays: [
        { title: this.$t("calendarMonday"), value: [1, 2, 3, 4, 5, 6, 0] },
        { title: this.$t("calendarSunday"), value: [0, 1, 2, 3, 4, 5, 6] },
        { title: this.$t("calendarSaturday"), value: [6, 0, 1, 2, 3, 4, 5] }
      ],
      selectedFirst: ""
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    loading() {
      return typeof this.user === "undefined";
    }
  },
  watch: {
    user: function(user) {
      const settings = user.settings;
      if (settings) {
        this.setModels(settings);
      }
    }
  },
  created() {
    if (this.user.settings) {
      this.setModels(this.user.settings);
    }
  },
  methods: {
    changeMode() {
      this.$store.state.user.settings.layout.dark = this.darkMode;
    },
    setModels(settings) {
      this.theme = settings.layout.theme;
      this.darkMode = settings.layout.dark;

      const index = this.weekdays.findIndex(
        day => day.value[0] === settings.calendar.weekSchema[0]
      );
      this.selectedFirst = this.weekdays[index];
    }
  },

  beforeRouteLeave(to, from, next) {
    api.updateLayout({
      dark: this.darkMode,
      theme: this.theme
    });

    api.updateCalendar({
      weekSchema: Array.isArray(this.selectedFirst)
        ? this.selectedFirst
        : this.selectedFirst.value
    });

    this.$store.dispatch("getUserData");
    next();
  }
};
</script>