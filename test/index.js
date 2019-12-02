import Vue from 'vue'
import { ButtonGroup, Button, Input } from 'view-design'
import 'view-design/dist/styles/iview.css'
import App from './App.vue'
import tabs from '../src'

Vue.component('ButtonGroup', ButtonGroup)
Vue.component('Button', Button)
Vue.component('Input', Input)
Vue.use(tabs)

var app = new Vue({
  el: '#app',
  template: '<App />',
  components: { App }
})
