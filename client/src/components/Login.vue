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
                :label="$t(`formEmailLabel`)"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                v-model="email"
                :rules="loginRules"
                required
              ></v-text-field>

              <v-text-field
                id="password"
                :label="$t(`formPasswordLabel`)"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
                :rules="loginRules"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login" :disabled="!valid" large>{{
              $t("appLoginTitle")
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
      email: "",
      password: "",
      drawer: null,
      loginRules: [value => !!value || this.$t("formRequired")],
      valid: false
    };
  },
  methods: {
    login: function() {
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("login", { email, password })
        .then(() => this.$router.push("/"));
    }
  }
};
</script>