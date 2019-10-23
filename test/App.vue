<template>
  <div class="main">
    <a href="https://github.com/qq240814476/vue-tab-component">
      <img style="position: absolute; top: 0; right: 0; border: 0;" src="./assets/fork.png">
    </a>
    <div class='howtouse'>
      <div class='senMain'>
        vue-tab-component
      </div>
    </div>
    <div class="tabs-demo">
      <ButtonGroup style='margin-bottom:10px;'>
        <Button @click="changePosition(item)" v-for="(item, index) in poss" :key="index">{{item}}</Button>
      </ButtonGroup>
      <ButtonGroup style='margin-bottom:10px;'>
        <Button @click="changeOffset(index)" type="primary" v-for="(item, index) in moreBtns" :key="index" :icon="item"></Button>
      </ButtonGroup>
      <ButtonGroup style='margin-bottom:10px;'>
        <Button @click="addItem(item)">增加</Button>
      </ButtonGroup>
      <ButtonGroup style='margin-bottom:10px;'>
        <Button @click="changeActiveTab(index)" v-for="(item, index) in changeActive" :key="index">{{item}}</Button>
        <span>切到指定的tab:</span>
        <Input v-model='activeTab' style="width: 80px" placeholder="输入指定tab id"/>
      </ButtonGroup>
      <ButtonGroup style='margin-bottom:10px;'>
        <Button @click="isHideBar()" >toggle左右图标</Button>
      </ButtonGroup>
      <div style="height:300px;width:100%;position:relative">
        <tabs :data="tabsData" 
        :tab-position="position" 
        closable
        :hideDirectionBar="isHide"
        @on-click="onClick" 
        ref="tabs"
        type="card"
        :active-name="activeTab"
        @on-tab-remove="removeTab"/>
      </div>
      <div class="line-style">
        line 的样式
      </div>
      <div style="height:300px;width:100%;position:relative">
        <tabs :data="tabsData"
        :tab-position="position" 
        closable
        :hideDirectionBar="isHide"
        @on-click="onClick" 
        ref="tabs1"
        type="line"
        :active-name="activeTab"
        @on-tab-remove="removeTab"/>
      </div>
    </div>
    <div class="github-info">
      <div class='sentence'>
        <a href='https://github.com/qq240814476/vue-tab-component' target='_blanket'>View Documentation</a>
      </div>
      <iframe src="https://ghbtns.com/github-btn.html?user=qq240814476&repo=vue-tab-component&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>
      <a href="https://996.icu" target='_blank'><img src="https://img.shields.io/badge/link-996.icu-red.svg"></a>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      tabsData:[],
      poss:['top','bottom','left','right'],
      moreBtns: ['ios-skip-backward-outline', 'ios-skip-backward', 'ios-skip-forward', 'ios-skip-forward-outline'],
      changeActive: ['切回选中的tab'],
      position: 'top',
      activeTab: '',
      isHide: false
    }
  },
  methods: {
    isHideBar(){
      this.isHide = !this.isHide
    },
    changePosition(pos){
      this.position = pos
    },
    changeOffset(index){
      switch (index) {
        case 0 :
          this.$refs.tabs.goBegin()
          break;
        case 1 :
          this.$refs.tabs.scrollPrev()
          break;
        case 2 :
          this.$refs.tabs.scrollNext()
          break;
        case 3 :
          this.$refs.tabs.goEnd()
          break;
      }
    },
    changeActiveTab(index){
      this.$refs.tabs.scrollToActiveTab()
    },
    onClick(key){
      this.activeTab = key
    },
    addItem(){
      this.tabsData.push({key: (this.tabsData.length+1).toString(), title:this.tabsData.length+1})
      this.activeTab = this.tabsData.length.toString()
    },
    removeTab(key){
      let index = this.tabsData.findIndex(item => item.key === key)
      this.$delete(this.tabsData, index)
    }
  },
  mounted(){
    for(let i = 1; i<100; i++){
      this.tabsData.push({key: i.toString(), title: '一二三' + i})
    }
  }
}
</script>
<style scoped>
@font-face {
  font-family: "Tangerine";
  src: url("./assets/Tangerine-Regular.ttf");
}
.main{
  width: 100%;
  height: 800px;
  position: relative;
}
.tabs-demo{
  width: 800px;
  height: 600px;
  left: 27%;
  position: absolute;
  margin-top: 50px;
  overflow: hidden;
}
.github-info{
  bottom: 0;
  left: 38%;
  position: absolute;
}
.sentence {
  margin: 2rem auto;
  font-size: 25px;
}

a {
  text-decoration: none;
  color: #8492a6;
}
.senMain {
  background: white;
  padding: 1rem;
  color: #8492a6;
}

.howtouse {
  margin-left: 30%;
  text-align: center;
  width: 30%;
  background: #e5e9f2;
  margin-top: 1rem;
  padding: 1rem;
  font-weight: bold;
}
.howtouse > div {
  font-family: "Tangerine", cursive;
  font-size: 3rem;
}

.line-style{
  text-align:center;
  margin-bottom:20px;
  font-weight: bold;
  font-size:16px;
  opacity: 0.8;
}
</style>

