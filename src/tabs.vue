<template>
  <div :class='mainClass'>
    <div class='ml-tab-container' :style="containerPadding">
      <span :class='{"ml-tab-container-left": true, "hide-bar": hideContainerBar}' slot='left-icon' @click='scrollPrev'>
        <Icon type='ios-arrow-back'/>
      </span>
      <span :class='{"ml-tab-container-right": true, "hide-bar": hideContainerBar}' slot='right-icon' @click='scrollNext'>
        <Icon type='ios-arrow-forward'/>
      </span>

      <div ref='navScroll' class='ml-tab-item-scroll'>
        <div ref='nav' class='ml-tab-item-scroll-nav' :style='navStyle'>
          <div
            @mouseenter="(e) => mouseEnter(e, item)"
            @mouseleave="mouseLeave"
            @click.stop='onTabClick(item)'
            v-for='(item, index) in showList'
            :key='index'
            :class="{'ml-tab-item': true, 'ml-tab-item-active': item.key === currActive, 'ml-tab-item-disabled': true}"
          >
            <div class='ml-tab-item-slot'>
              <slot name='tab' :data='item'>
                <div>{{item.title}}</div>
              </slot>
            </div>
            <div v-if='showClose(item)' class="ml-tab-item-close-div">
              <Icon
                class="ml-tab-item-close"
                type='ios-close'
                @click.stop='handleRemove(item)'
              ></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class>
      <div slot='extra'></div>
    </div>
  </div>
</template>
<script>
import maxNumMixin from './mixins/maxNumMixin.js'
import offsetMixin from './mixins/offsetMixin.js'

export default {
  mixins: [offsetMixin, maxNumMixin],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tabPosition: {
      type: String,
      default: 'top',
      validator: function(str) {
        const arr = ['top', 'right', 'left', 'bottom'];
        return arr.filter(val => val === str).length > 0;
      }
    },
    type: {
      type: String,
      default: 'line',
      validator: function(str) {
        const arr = ['line', 'card'];
        return arr.filter(val => val === str).length > 0;
      }
    },
    closable: {
      type: Boolean,
      default: false
    },
    stretch: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: String,
      default: ''
    },
    beforeChangeTab: {
      type: Function,
      default: () => true
    },
    hideDirectionBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currActive: this.activeName,
      hoverId: ''
    };
  },
  watch: {
    activeName(val) {
      this.currActive = this.activeName;
    },
    currActive(val) {
      this.scrollToActiveTab();
    },
    data: {
      deep:true,
      handler: function(val){
        this.showList = this.dataLength <= this.maxnum ? val : val.slice(0, this.maxnum)
      }
    }
  },
  computed: {
    isHorizontal() {
      return ['top', 'bottom'].indexOf(this.tabPosition) !== -1;
    },
    mainClass() {
      return {
        'ml-tab': true,
        [`ml-tab-is-${this.tabPosition}`]: true,
        'card': this.type === 'card',
        'line': this.type === 'line',
      }
    },
    containerPadding () {
      let style = {
        padding: '0px'
      }
      if(!this.hideContainerBar){
        style.padding = this.isHorizontal ? '0 20px' : '20px 0'
      }
      return style
    }
  },
  methods: {
    itemIcon (item) {
      return item.icon ? item.icon : 'ios-unlock-outline'
    },
    onTabClick(item) {
      if (this.currActive !== item.key) {
      this.$emit('on-click', item.key);
        if(this.beforeChangeTab()){
          this.currActive = item.key;
        }
      }
    },
    showClose(item) {
      return (
        !item.disabled &&
        this.closable &&
        this.type === 'card' &&
        (this.currActive === item.key || this.hoverId === item.key)
      );
    },
    handleRemove(item) {
      this.$emit('on-tab-remove',item.key);
    },
    mouseEnter (e, item) {
      if(!item.disabled){
        this.hoverId = item.key
      }
    },
    mouseLeave () {
      this.hoverId = ''
    }
  }
};
</script>
<style scoped>
@import './css/card.css';
@import './css/line.css';
.hide-bar{
  display: none;
}
.ml-tab-item{
  cursor: pointer;
}
</style>
