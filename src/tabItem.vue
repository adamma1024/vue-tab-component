<template>
  <div>
    <div @click="onTabClick" v-for="(item, index) in data" :key="index" :class="{'ml-tab-item': true, 'ml-tab-item-active': isActive}">
      <template slot="tab" :tab="item" class="ml-tab-item ml-tab-item-slot">
        <Icon :type="item.icon ? item.icon : ios-woman"></Icon>
        <span>{{item.text}}</span>
      </template>
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
      default: 'bottom',
      validator: (str) => {
        const arr = ['top', 'right', 'left', 'bottom']
        return arr.filter((val) => val === str).length >= 0
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
        return arr.filter((val) => val === str).length >= 0
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
      currActive: this.activeName
    }
  },
  computed:{
    isActive(){
      return 
    }
  },
  methods: {
    onTabClick(){

    }
  }
}
</script>
<style scoped>
.ml-tab-item{
  display: inline-block;
}
.ml-tab-item-slot{
    padding: 0 20px;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
}
</style>
