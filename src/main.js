import Vue from 'vue'
import App from './components/App.vue'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


Vue.config.productionTip = false

new Vue({
  store,
  render: function (h) { return h(App) },
}).$mount('#app')
