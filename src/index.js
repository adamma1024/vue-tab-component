import tabs from './tabs.vue'

const tab = {
  install: function (Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('tabs', tabs)
  }
}

export default tab
