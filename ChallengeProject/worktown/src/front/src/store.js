import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    loginUser: null
  },
  mutations: {
    login (state, token) {
      state.token = token
    },
    user (state, user) {
      state.loginUser = user
    },
    logout (state) {
      state.token = null
      state.loginUser = null
    }
  },
  actions: {

  }
})
