<template>
  <div :class='mainClass'>
    <div class='ml-tab-container'>
      <span class='ml-tab-container-left' slot='left-icon' @click='scrollPrev'>
        <Icon type='ios-arrow-back'/>
      </span>
      <span class='ml-tab-container-right' slot='right-icon' @click='scrollNext'>
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
            :class="{'ml-tab-item': true, 'ml-tab-item-active': item.id === currActive, 'ml-tab-item-disabled': true}"
          >
            <div slot='tab' :tab='item' class='ml-tab-item-slot'>
              <Icon :type='itemIcon(item)'></Icon>
              <div>{{item.text}}</div>
            </div>
            <div class="ml-tab-item-close-div">
              <Icon
                v-if='showClose(item)'
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
    }
  },
  computed: {
    isHorizontal() {
      return ['top', 'bottom'].indexOf(this.tabPosition) !== -1;
    },
    mainClass() {
      return {
        'ml-tab': true,
        [`is-${this.tabPosition}`]: true,
        'card': this.type === 'card',
        'line': this.type === 'line',
      }
    }
  },
  methods: {
    itemIcon (item) {
      return item.icon ? item.icon : 'ios-unlock-outline'
    },
    onTabClick(item) {
      if (this.currActive !== item.id) {
        this.currActive = item.id;
        this.$emit('on-click', item.id);
      }
    },
    showClose(item) {
      return (
        !item.disabled &&
        this.closable &&
        this.type === 'card' &&
        (this.currActive === item.id || this.hoverId === item.id)
      );
    },
    handleRemove(item) {
      this.$emit('on-tab-remove',item.id);
    },
    mouseEnter (e, item) {
      if(!item.disabled){
        this.hoverId = item.id
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
</style>
