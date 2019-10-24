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
            :id="`ml-tab-${index}`"
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
  mixins: [ offsetMixin, maxNumMixin ],
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
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currActive: this.activeName,
      hoverId: '',
      displayArray: [],
      beginTab: '',
      endTab: '',
    };
  },
  watch: {
    activeName(val) {
      this.currActive = this.activeName;
    },
    currActive(val) {
      this.scrollToActiveTab();
    },
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
        [`${this.className}`]: this.className ? true : false,
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
    },
    itemInDisplay(entries, observer){
      entries.forEach(entry => {{
        if (entry.isIntersecting) {
          this.displayArray.push({
            index:Number.parseInt(entry.target.id.substr(7)),
            boundLeftOrTop: this.isHorizontal ? entry.boundingClientRect.left : entry.boundingClientRect.top
          })
        } else {
          // 如果在数组中，剔除
          let index = this.displayArray.findIndex((obj) => (obj.index.toString() === entry.target.id.substr(7)))
          if(index > -1){
            this.displayArray.splice(index, 1)
          }
        }
      }})
      // 数字，基础类型直接等于[0]即可
      // pop 和 shift 必然没有直接取值快
      // 记录 可视区 的 显示完整的 首个元素 和 最后一个元素
      this.beginTab = this.displayArray[0]
      this.endTab = this.displayArray[this.displayArray.length - 1]
    }
  },
  mounted(){
    var that = this
    this.$nextTick(()=>{{
      var options = {
        root: that.$refs.navScroll,
        rootMargin: '0px',
        threshold: 1
      }
      var observer = new IntersectionObserver(that.itemInDisplay, options)
      var tabs = that.$refs.nav.children
      for(let item of tabs){
        observer.observe(item)
      }
    }})
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
