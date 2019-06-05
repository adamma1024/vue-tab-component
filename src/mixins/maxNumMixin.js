export default {
  props: {
    maxnum: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      dataLength: this.data.length,
      showList: this.dataLength <= this.maxnum ? this.data : this.data.slice(0, this.maxnum),
      hideContainerBar: true
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function (val, oldval) {
        if (this.dataLength !== val.length) {
          this.dataLength = val.length
          this.updataShowList()
          // 是否隐藏向左向右箭头
          this.isHideLRIcon()
        } else {
          // 数量不变，数据更新，记录offset，更新数据，设置offset
          // TODO（还需要修改，如果内容长度改变很大，offset也记录不准确）
          const recordOffset = this.getCurrentScrollOffset(this.isHorizontal ? 1 : 2)
          this.setOffset(0, 0)
          this.updateShowListData()
          this.isHorizontal ? this.setOffset(recordOffset, 0) : this.setOffset(0, recordOffset)
        }
      }
    },
    hideDirectionBar () {
      this.isHideLRIcon()
    }
  },
  computed: {
    beginPos () {
      let index = -1
      if (this.showList.length === this.maxnum) {
        index = this.data.findIndex(obj => obj.id === this.showList[0].id)
      }
      return index
    }
  },
  methods: {
    /**
     * 更新显示的list
     */
    updataShowList () {
      // data数量改变，showList重置，如果要定位请设置activeTab
      this.showList = this.dataLength <= this.maxnum ? this.data : this.data.slice(0, this.maxnum)
      this.scrollToActiveTab()
    },
    /**
     * 改变showList
     * @param {*} val showList
     */
    changeShowList (val) {
      const showIndex = this.showList.findIndex(obj => obj.id === val)
      if (showIndex !== -1) {
        return
      }
      const index = this.data.findIndex((obj) => obj.id === val)
      if (index !== -1) {
        if (this.dataLength <= this.maxnum) {
          this.showList = this.data
        } else if (index <= this.maxnum / 2) {
          this.showList = this.data.slice(0, this.maxnum)
        } else if ((this.dataLength - index) >= (this.maxnum / 2)) {
          this.showList = this.data.slice(index - this.maxnum / 2, index + (this.maxnum - this.maxnum / 2))
        } else {
          this.showList = this.data.slice(this.dataLength - this.maxnum, this.dataLength)
        }
      }
    },
    /**
     * 判断是否隐藏左右移动按钮
     */
    isHideLRIcon () {
      if (this.hideDirectionBar) {
        this.hideContainerBar = true
      } else {
        let nav = ''
        let container = ''
        setTimeout(() => {
          nav = this.isHorizontal
            ? this.$refs.nav.offsetWidth
            : this.$refs.nav.offsetHeight
          container = this.isHorizontal
            ? this.$refs.navScroll.offsetWidth
            : this.$refs.navScroll.offsetHeight
          this.hideContainerBar = nav <= container
        })
      }
    },
    updateShowListData () {
      if (this.showList.length === this.maxnum) {
        this.showList = [...this.data.slice(this.beginPos, this.beginPos + this.maxnum)]
      } else {
        this.showList = [...this.data]
      }
    }
  },
  mounted () {
    this.isHideLRIcon()
  }
}
