import Vue from 'vue'
import { Tooltip, Icon } from 'view-design'
import tabs from './tabs.vue'

Vue.component('Tooltip', Tooltip)
Vue.component('Icon', Icon)

const tab = {
  install: function (Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('tabs', tabs)
  }
}

export default tab
