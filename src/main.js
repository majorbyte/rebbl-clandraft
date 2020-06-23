import Vue from 'vue'
import App from './components/App.vue'
import ToastPlugin from "./ToastPlugin.js";
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(ToastPlugin);

Vue.config.productionTip = false

new Vue({
  store,
  render: function (h) { return h(App) },
}).$mount('#app')
