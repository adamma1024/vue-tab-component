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
            @click='onTabClick(item)'
            v-for='(item, index) in showList'
            :key='index'
            :class="{'ml-tab-item': true, 'ml-tab-item-active': item.id === currActive, 'ml-tab-item-disabled': true}"
          >
            <div slot='tab' :tab='item' class='ml-tab-item-slot'>
              <Icon :type='item.icon ? item.icon : ios-woman'></Icon>
              <span>{{item.text}}</span>
              <Icon
                v-if='showClose(item)'
                :type='ios-close'
                @click.native.stop='handleRemove(item)'
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
  mixins: [maxNumMixin, offsetMixin],
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
      hoverItem: ''
    };
  },
  watch: {
    activeName(val) {
      this.currActive = this.activeName;
    },
    currActive(val) {
      this.changeShowList(val);
      this.$emit('on-active-tab-change', val);
      this.$nextTick(() => {
        this.scrollToActiveTab();
      });
    }
  },
  computed: {
    isHorizontal() {
      return ['top', 'bottom'].indexOf(this.tabPosition) !== -1;
    }
  },
  methods: {
    onTabClick(item) {
      if (this.currActive !== item.id) {
        this.currActive = item.id;
        this.$emit('on-tab-change', item);
      }
    },
    showClose(item) {
      return (
        !item.disabled &&
        this.closable &&
        this.type === 'card' &&
        (this.currActive === item.id || this.hoverItem === item.id)
      );
    },
    handleRemove(item) {
      this.$emit('on-tab-close');
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
  padding: 0px;
  box-sizing: border-box;
  line-height: 28px;
  list-style: none;
  font-size: 13px;
  color: #303133;
  position: relative;
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
}
.ml-tab-container-right {
  right: 0px;
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
.is-left .ml-tab-item {
  transform: rotate(270deg) translate(-5px);
  -ms-transform: rotate(270deg) translate(-5px); /* Internet Explorer 9*/
  -moz-transform: rotate(270deg) translate(-5px); /* Firefox */
  -webkit-transform: rotate(270deg) translate(-5px); /* Safari 和 Chrome */
  -o-transform: rotate(270deg) translate(-5px); /* Opera */
}
.is-right .ml-tab-item {
  transform: rotate(90deg) translate(5px);
  -ms-transform: rotate(90deg) translate(5px); /* Internet Explorer 9*/
  -moz-transform: rotate(90deg) translate(5px); /* Firefox */
  -webkit-transform: rotate(90deg) translate(5px); /* Safari 和 Chrome */
  -o-transform: rotate(90deg) translate(5px); /* Opera */
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
.is-left .ml-tab-container-left,
.is-right .ml-tab-container-left {
  top: 0;
  line-height: 45px;
  transform: rotate(90deg) translate(-11px, -15px);
  -ms-transform: rotate(90deg) translate(-11px, -15px); /* Internet Explorer 9*/
  -moz-transform: rotate(90deg) translate(-11px, -15px); /* Firefox */
  -webkit-transform: rotate(90deg) translate(-11px, -15px); /* Safari 和 Chrome */
  -o-transform: rotate(90deg) translate(-11px, -15px); /* Opera */
}
.is-left .ml-tab-container-right,
.is-right .ml-tab-container-right {
  bottom: 0;
  line-height: 45px;
  transform: rotate(90deg) translate(15px, 16px);
  -ms-transform: rotate(90deg) translate(15px, 16px); /* Internet Explorer 9*/
  -moz-transform: rotate(90deg) translate(15px, 16px); /* Firefox */
  -webkit-transform: rotate(90deg) translate(15px, 16px); /* Safari 和 Chrome */
  -o-transform: rotate(90deg) translate(15px, 16px); /* Opera */
}
.is-left .ml-tab-item-scroll,
.is-right .ml-tab-item-scroll {
  height: 100%;
}
</style>
