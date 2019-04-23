<template>
  <div :class="`ml-tab is-${tabPosition}`">
    <div class="ml-tab-container">

      <span class="ml-tab-container-left" slot="left-icon" @click="scrollPrev">
        <Icon type="ios-arrow-back" />
      </span>
      <span class="ml-tab-container-right" slot="right-icon" @click="scrollNext">
        <Icon type="ios-arrow-forward" />
      </span>

      <div ref="navScroll" class="ml-tab-item-scroll">
        <div ref="nav" class="ml-tab-item-scroll-nav"  :style="navStyle">
          <div 
          @click="onTabClick(item)" 
          v-for="(item, index) in data" :key="index" 
          :class="{'ml-tab-item': true, 'ml-tab-item-active': item.id === currActive, 'ml-tab-item-disabled': true}">
            <div slot="tab" :tab="item" class="ml-tab-item-slot">
              <Icon :type="item.icon ? item.icon : ios-woman"></Icon>
              <span>{{item.text}}</span>
              <Icon v-if="showClose(item)" :type="ios-close" @click.native.stop="handleRemove(item)"></Icon>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class=''>
      <div slot="extra"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tabPosition: {
      type: String,
      default: 'top',
      validator: (str) => {
        const arr = ['top', 'right', 'left', 'bottom']
        return arr.filter((val) => val === str).length > 0
      }
    },
    maxnum: {
      type: Number,
      default: 30
    },
    type: {
      type: String,
      default: 'card',
      validator: (str) => {
        const arr = ['border-card', 'card']
        return arr.filter((val) => val === str).length > 0
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
  data(){
    return{
      currActive: this.activeName,
      hoverItem:'',
      navStyle: {
        transform: ''
      }
    }
  },
  watch:{
    activeName(val){
      this.currActive = this.activeName
    }
  },
  computed:{
  },
  methods: {
    onTabClick(item){
      this.currActive = item.id
    },
    showClose(item){
      return !item.disabled && this.closable && this.type === 'card' && (this.currActive === item.id || this.hoverItem === item.id)
    },
    handleRemove(item){
      this.$emit('on-tab-close')
    },
    scrollPrev() {
      const containerWidth = this.$refs.navScroll.offsetWidth;
      const currentOffset = this.getCurrentScrollOffset();

      if (!currentOffset) return;

      let newOffset = currentOffset > containerWidth
          ? currentOffset - containerWidth
          : 0;

      this.setOffset(newOffset);
    },
    scrollNext() {
      const navWidth = this.$refs.nav.offsetWidth;
      const containerWidth = this.$refs.navScroll.offsetWidth;
      const currentOffset = this.getCurrentScrollOffset();
      if (navWidth - currentOffset <= containerWidth) return;

      let newOffset = navWidth - currentOffset > containerWidth * 2
          ? currentOffset + containerWidth
          : (navWidth - containerWidth);

      this.setOffset(newOffset);
    },
    getCurrentScrollOffset() {
      const { navStyle } = this;
      return navStyle.transform
          ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1])
          : 0;
    },
    setOffset(value) {
      this.navStyle.transform = `translateX(-${value}px)`;
    },
  }
}
</script>
<style scoped>
.ml-tab-item{
  display: inline-block;
  padding: 2px 10px;
  margin-right: 5px;
  border: 1px solid #dcdee2;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
}
.ml-tab-container{
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  transition: all .3s ease-in-out;
}
.ml-tab-item-slot{
  transition: all .3s ease-in-out;
  display: inline-block;
  height: 28px;
  padding: 0px;
  box-sizing: border-box;
  line-height: 28px;
  list-style: none;
  font-size: 13px;
  color: #303133;
  position: relative;
}
.ml-tab-item.ml-tab-item-active{
  padding: 2px 10px 0px 10px;
  color: #5b87a5;
  border-bottom: 2px solid #5b87a5;
}
.ml-tab-container-left,
.ml-tab-container-right{
    position: absolute;
    line-height: 32px;
    cursor: pointer;
    font-size: 14px;
    z-index: 200;
    background: #fff;
}
.ml-tab-container-left{
  left: 0px;
}
.ml-tab-container-right{
  right: 0px;
}
.ml-tab-item-scroll{
  overflow: hidden;
  white-space: nowrap;
}
.ml-tab-item-scroll-nav{
  float: left;
  list-style: none;
}
.is-left{
  float: left;
  margin-bottom: 0;
  margin-right: 10px;
}
.is-bottom{
  margin-bottom: 0;
}
.is-right{
  float: right;
  margin-bottom: 0;
  margin-left: 10px;
}
.is-left .ml-tab-item,
.is-left .ml-tab-container-left,
.is-left .ml-tab-container-right{
  transform:rotate(270deg);
  -ms-transform:rotate(270deg); /* Internet Explorer 9*/
  -moz-transform:rotate(270deg); /* Firefox */
  -webkit-transform:rotate(270deg); /* Safari 和 Chrome */
  -o-transform:rotate(270deg); /* Opera */
}
.is-right .ml-tab-item,
.is-right .ml-tab-container-left,
.is-right .ml-tab-container-right{
  transform:rotate(90deg);
  -ms-transform:rotate(90deg); /* Internet Explorer 9*/
  -moz-transform:rotate(90deg); /* Firefox */
  -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
  -o-transform:rotate(90deg); /* Opera */
}
.is-left .ml-tab-item,
.is-right .ml-tab-item
{
  display: block;
  margin-bottom: 10px;
  filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
}
.is-left .ml-tab-container,
.is-right .ml-tab-container
{
  padding: 20px 0;
}
.is-left .ml-tab-container-left,
.is-right .ml-tab-container-left
{
  top: 0;
}
.is-left .ml-tab-container-right,
.is-right .ml-tab-container-right
{
  bottom: 0;
}
</style>
