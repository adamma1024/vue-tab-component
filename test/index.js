import Vue from 'vue'
import iview from 'view-design'
import 'view-design/dist/styles/iview.css'
import App from './App.vue'
import tabs from '../src'

Vue.use(iview)
Vue.use(tabs)

var app = new Vue({
  el: '#app',
  template: '<App />',
  components: { App }
})
