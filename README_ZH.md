# vue-tab-component

[![Version](http://img.shields.io/npm/v/vue-tab-component.svg)](https://www.npmjs.com/package/vue-tab-component)[![Downloads](http://img.shields.io/npm/dm/vue-tab-component.svg)](https://www.npmjs.com/package/vue-tab-component)[![License](https://img.shields.io/npm/l/vue-tab-component.svg?style=flat)](https://opensource.org/licenses/MIT)

> 基于Vue2.0的轻量级tab组件。可控制渲染数量

**功能**

- **自定义**实际渲染数量（处理tab过多情况）
- 提供**前进后退**方法
- 支持**left、right**排列
- tab内容区域提供**slot**，方便自定义

**[EN](README.md)** || **如果它对你有帮助的话，请Star支持！！！**
**[示例项目](https://github.com/qq240814476/vue-tab-component-demo)**

### 预览

------

![demo](static/vue-tab-component.gif)

### 快速开始

------

**Install**

`npm install vue-tab-component --save`

**Usage**

[一个简单的项目，用了vue-tab-component](https://github.com/qq240814476/vue-tab-component-demo)

main.js

```vue
import Vue from 'vue'
import tabs from 'vue-tab-component'

Vue.use(tabs)
```

### 接口

---

**属性**

| 属性名           | 描述                                                | 类型     | 默认值        |
| :--------------- | :-------------------------------------------------- | :------- | :------------ |
| data             | tab的数据    {key:'key',title:'文字'}               | Array    | []            |
| tabPosition      | tab位置,总共有四种: top、bottom、left、right        | String   | bottom        |
| type             | 样式种类，有card、line 两种                         | String   | line          |
| closable         | 是否可删除tab                                       | Boolean  | false         |
| activeName       | 当前激活状态的key                                   | String   | ''            |
| maxnum           | 最多渲染多少tab，用以解决大数据量tab                | Number   | 20            |
| beforeChangeTab  | 参数是key，切换tab之前，可以返回boolean值，阻止切换 | Function | (key) => true |
| stretch （todo） | 是否根据tab内容长度伸缩                             | Boolean  | false         |
| hideDirectionBar | 是否隐藏左右方向图标                                | Boolean  | false         |

**方法**

| 方法名            | 描述                | 参数 |
| ----------------- | ------------------- | ---- |
| goBegin           | 跳转到tab起始位置   | -    |
| goEnd             | 跳转到tab末尾       | -    |
| scrollPrev        | 向前滑动tab         | -    |
| scrollNext        | 向后滑动tab         | -    |
| scrollToActiveTab | 定位到active的tab上 | -    |

**事件**

| 事件名        | 描述                          | 参数         |
| ------------- | ----------------------------- | ------------ |
| on-click      | 当tab点击时触发，返回tab的key | key tab的key |
| on-tab-remove | 当删除tab时触发，返回tab的key | key tab的key |

**插槽**

| 插槽名 | 数据             | 例子                                                                 |
| ------ | ---------------- | -------------------------------------------------------------------- |
| tab    | tab：单个tab数据 | <template #tab="{ data }"><Icon :type="data.icon"></Icon></template> |


**License**

------

[The 996ICU License (996ICU)](LICENSE)
