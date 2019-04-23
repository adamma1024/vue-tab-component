import Vue from 'vue'
import iview from 'iview'
import tabs from './tabs.vue'

Vue.use(iview)

const tab = {
  install: function (Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('tabs', tabs)
  }
}

export default tab
