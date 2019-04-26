<template>
  <div :class='`ml-tab is-${tabPosition}`'>
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
      default: 'card',
      validator: function(str) {
        const arr = ['border-card', 'card'];
        return arr.filter(val => val === str).length > 0;
      }
    },
    closable: {
      type: Boolean,
      default: false
    },
    addable: {
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
      this.$emit('on-active-tab-change', val);
      this.scrollToActiveTab();
    }
  },
  computed: {
    isHorizontal() {
      return ['top', 'bottom'].indexOf(this.tabPosition) !== -1;
    }
  },
  methods: {
    itemIcon (item) {
      return item.icon ? item.icon : 'ios-unlock-outline'
    },
    onTabClick(item) {
      if (this.currActive !== item.id) {
        this.currActive = item.id;
        this.$emit('on-click', item);
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
.ml-tab-item {
  display: inline-block;
  padding: 2px 10px;
  margin-right: 5px;
  border: 1px solid #dcdee2;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  transition: padding-left 0.3s ease-in-out;
}
.ml-tab-item:hover{
  padding: 2px 4px;
  color:#409EFF;
}
.ml-tab-container {
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;
}
.ml-tab-item-slot {
  transition: all 0.3s ease-in-out;
  display: inline-block;
  height: 28px;
  line-height: 28px;
  padding: 0px;
  box-sizing: border-box;
  list-style: none;
  font-size: 13px;
  color: #303133;
  position: relative;
}
.ml-tab-item-slot div,
.ml-tab-item-close-div{
  display: inline-block;
  vertical-align: middle;
}
.is-left .ml-tab-item,
.is-right .ml-tab-item{
  display: block;
  padding: 10px 2px;
  margin-bottom: 5px;
  border: 1px solid #dcdee2;
  transition: padding-top 0.3s ease-in-out;
}
.is-left .ml-tab-item:hover,
.is-right .ml-tab-item:hover{
  padding: 4px 2px;
}
.is-left .ml-tab-item-close
.is-right .ml-tab-item-close{
  margin-left: 15px;
}
.is-left .ml-tab-item{
  border-right: 0;
  border-radius: 4px 0px 0px 4px;
}
.is-right .ml-tab-item{
  border-left: 0;
  border-radius: 0px 4px 4px 0;
}
.is-left .ml-tab-item div,
.is-right .ml-tab-item div{
  display: block;
  margin: auto;
  text-align: center;
  width: 28px;
  font-size: 13px;
  line-height: 28px;
}
.is-left .ml-tab-item-slot div,
.is-right .ml-tab-item-slot div{
  writing-mode: vertical-lr;
  letter-spacing: 2px;
}
.is-left i,
.is-right i,
.is-left .ml-tab-item-slot,
.is-right .ml-tab-item-slot{
  height: auto;
}
.ml-tab-item.ml-tab-item-active {
  padding: 2px 10px 0px 10px;
  color: #5b87a5;
  border-bottom: 2px solid #5b87a5;
}
.ml-tab-container-left,
.ml-tab-container-right {
  position: absolute;
  line-height: 32px;
  cursor: pointer;
  font-size: 14px;
  z-index: 200;
  background: #fff;
}
.ml-tab-container-left {
  left: 0px;
  transition: all 0.3s ease-in-out;
}
.ml-tab-container-right {
  right: 0px;
  transition: all 0.3s ease-in-out;
}
.ml-tab-item-scroll {
  overflow: hidden;
  white-space: nowrap;
}
.ml-tab-item-scroll-nav {
  float: left;
  list-style: none;
  transition: all 0.3s ease-in-out;
}
.is-left {
  float: left;
  height: 100%;
  margin-bottom: 0;
  margin-right: 10px;
}
.is-bottom {
  margin-bottom: 0;
}
.is-right {
  float: right;
  height: 100%;
  margin-bottom: 0;
  margin-left: 10px;
}
.is-left .ml-tab-item,
.is-right .ml-tab-item {
  display: block;
  margin-bottom: 10px;
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
}
.is-left .ml-tab-container,
.is-right .ml-tab-container {
  height: 100%;
  padding: 20px 0;
}
.is-left .ml-tab-item-scroll,
.is-right .ml-tab-item-scroll {
  height: 100%;
}
.is-left .ml-tab-container-left,
.is-right .ml-tab-container-left {
  top: 0;
  transform: rotate(90deg) translateY(-3px);
  transform-origin: right center;
  -ms-transform: rotate(90deg) translateY(-3px); /* Internet Explorer 9*/
  -ms-transform-origin: right center;
  -moz-transform: rotate(90deg) translateY(-3px); /* Firefox */
  -moz-transform-origin: right center;
  -webkit-transform: rotate(90deg) translateY(-3px); /* Safari 和 Chrome */
  -webkit-transform-origin: right center;
  -o-transform: rotate(90deg) translateY(-3px); /* Opera */
  -o-transform-origin: right center;
}
.is-left .ml-tab-container-right,
.is-right .ml-tab-container-right {
  bottom: 0;
  transform: rotate(90deg) translateY(6px);
  transform-origin: left center;
  -ms-transform: rotate(90deg) translateY(6px); /* Internet Explorer 9*/
  -ms-transform-origin: left center;
  -moz-transform: rotate(90deg) translateY(6px); /* Firefox */
  -moz-transform-origin: left center;
  -webkit-transform: rotate(90deg) translateY(6px); /* Safari 和 Chrome */
  -webkit-transform-origin: left center;
  -o-transform: rotate(90deg) translateY(6px); /* Opera */
  -o-transform-origin: left center;
}
.ml-tab-item-close:hover{
  background-color: #C0C4CC;
  color: #FFFFFF;
}
.ml-tab-item-close{
  font-size: 16px;
  border-radius: 50%;
  vertical-align: text-top;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
