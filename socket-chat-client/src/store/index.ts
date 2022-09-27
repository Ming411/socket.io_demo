import { createStore } from 'vuex'

export default createStore({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') as string)
  },
  getters: {
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload.user
      window.localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  }
})
