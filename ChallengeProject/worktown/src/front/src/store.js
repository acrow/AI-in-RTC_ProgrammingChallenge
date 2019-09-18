import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    loginUser: null,
    team: null
  },
  mutations: {
    login (state, token) {
      state.token = token
    },
    user (state, user) {
      state.loginUser = user
    },
    team (state, team) {
      state.team = team
    },
    logout (state) {
      state.token = null
      state.loginUser = null
      state.team = null
    }
  },
  actions: {

  }
})
