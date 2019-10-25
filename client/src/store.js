import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import moment from "vue-moment"

Vue.use(Vuex)
Vue.use(moment)

export default new Vuex.Store({
	state: {
		status: "",
		token: localStorage.getItem("token") || "",
		user: {}
	},
	mutations: {
		authRequest(state) {
			state.status = "loading"
		},
		authSuccess(state, {
			token,
			user
		}) {
			state.status = "success",
				state.token = token,
				state.user = user
		},
		authError(state) {
			state.status = "error"
		},
		logout(state) {
			state.status = "",
				state.token = "",
				state.user = {}
		},
	},
	actions: {
		login({
			commit,
			dispatch
		}, user) {
			return new Promise((resolve, reject) => {
				commit("authRequest");
				axios.post("http://localhost:3000/api/auth", user)
					.then(resp => {
						const token = resp.data;
						localStorage.setItem("token", token);
						axios.defaults.headers.common["x-auth-token"] = token;
						dispatch("getUserData").then(() => {
							resolve(resp);
						});
					})
					.catch(err => {
						commit("authError")
						localStorage.removeItem("token")
						reject(err)
					})
			});
		},
		getUserData({
			commit
		}) {
			let user;
			const token = localStorage.getItem("token");
			axios.defaults.headers.common["x-auth-token"] = token;
			return axios.get("http://localhost:3000/api/users/me")
				.then(res => {
					user = res.data;
				})
				.then(() => {
					commit("authSuccess", {
						token,
						user
					});
				});
		},
		register({
			commit
		}, user) {
			return new Promise((resolve, reject) => {
				commit("authRequest");
				axios.post("http://localhost:3000/api/users", user)
					.then(resp => {
						const token = resp.headers["x-auth-token"];
						const user = resp.data;
						localStorage.setItem("token", token);
						axios.defaults.headers.common["x-auth-token"] = token;
						commit("authSuccess", {
							token,
							user
						});
						resolve(resp);
					})
					.catch(err => {
						commit("authError", err);
						localStorage.removeItem("token");
						reject(err);
					})
			});
		},
		logout({
			commit
		}) {
			return new Promise((resolve, reject) => {
				commit("logout");
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				delete axios.defaults.headers.common["x-auth-token"];
				resolve();
			});
		},
		async getEvents({
			state,
			dispatch
		}, {
			dateRangeMin = "",
			dateRangeMax = ""
		}) {
			if (Object.entries(state.user).length === 0) {
				await dispatch("getUserData");
			}

			return axios.get(`http://localhost:3000/api/users/${state.user._id}/events?startDate=${dateRangeMin}&endDate=${dateRangeMax}`)
				.then(res => {
					const events = res.data;
					const eventsMapped = events.map(event => {
						event.start = Vue.moment(event.startDate).format("YYYY-MM-DD HH:mm");
						event.end = Vue.moment(event.endDate).format("YYYY-MM-DD HH:mm");
						return event;
					});
					return eventsMapped;
				})
				.catch(err => {
					return [];
				});
		}
	},
	getters: {
		isLoggedIn: state => !!state.token,
		authStatus: state => state.status,
	}
})