<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ $t("appLoginTitle") }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                :label="$t(`formNameLabel`)"
                name="name"
                prepend-icon="mdi-account-card-details"
                type="text"
                v-model="name"
                :rules="nameRules"
                required
              ></v-text-field>

              <v-text-field
                :label="$t(`formEmailLabel`)"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                v-model="email"
                :rules="emailRules"
                required
              ></v-text-field>

              <v-text-field
                id="password"
                :label="$t(`formPasswordLabel`)"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-text-field
                id="password-repeat"
                :label="$t(`formPasswordRepeatLabel`)"
                name="passwordRepeat"
                prepend-icon="mdi-lock"
                type="password"
                v-model="passwordConfirmation"
                :rules="repeatPasswordRule"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="register" :disabled="!valid" large>{{
              $t("appRegisterTitle")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      repeatPasswordRule: [
        this.isRequired,
        value =>
          this.password === this.passwordConfirmation ||
          this.$t("formPasswordMatch")
      ],
      passwordRules: [
        this.isRequired,
        value => value.length >= 5 || this.$t("formPasswordLength")
      ],
      nameRules: [
        this.isRequired,
        value => value.length >= 5 || this.$t("formNameLength")
      ],
      emailRules: [
        this.isRequired,
        value => /.+@.+/.test(value) || this.$t("formValidEmail")
      ],
      valid: false
    };
  },
  methods: {
    register: function() {
      let data = {
        name: this.name,
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("register", data).then(() => this.$router.push("/"));
    },
    isRequired(value) {
      return !!value || this.$t("formRequired");
    }
  }
};
</script>
