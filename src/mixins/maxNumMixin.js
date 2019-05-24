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
    'data.length' (val) {
      this.dataLength = val
      this.updataShowList(val)
      // 是否隐藏向左向右箭头
      this.isHideLRIcon()
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
    updataShowList () {
      this.scrollToActiveTab()
    },
    changeShowList (val) {
      let index = this.data.findIndex((obj) => obj.id === val)
      if (index !== -1) {
        let length = this.dataLength
        if (length <= this.maxnum) {
          this.showList = this.data
        } else if (index <= this.maxnum / 2) {
          this.showList = this.data.slice(0, this.maxnum)
        } else if ((length - index) >= (this.maxnum / 2)) {
          this.showList = this.data.slice(index - this.maxnum / 2, index + (this.maxnum - this.maxnum / 2))
        } else {
          this.showList = this.data.slice(length - this.maxnum, length)
        }
      }
    },
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
    }
  },
  mounted () {
    this.isHideLRIcon()
  }
}
