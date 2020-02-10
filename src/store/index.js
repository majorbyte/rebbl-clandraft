import Vue from 'vue'
import Vuex from 'vuex'
import draft from './modules/draft'
import powers from './modules/powers'
import createLogger from '../plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    draft,
    powers
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})