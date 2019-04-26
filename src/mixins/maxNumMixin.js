export default {
  props: {
    maxnum: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      dataLength: this.data.length,
      showList: this.dataLength <= this.maxnum ? this.data : this.data.slice(0, this.maxnum)
    }
  },
  watch: {
    'data.length' (val) {
      this.dataLength = val
      this.updataShowList(val)
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
    updataShowList (val) {
      if (val <= this.maxnum) {
        this.showList = this.data
      } else {
        this.changeShowList(this.currActive)
      }
      this.$nextTick(() => {
        this.scrollToActiveTab()
      })
    },
    changeShowList (val) {
      if (val && this.beginPos !== -1) {
        let index = this.data.findIndex((obj) => obj.id === val)
        if (index !== -1) {
          let length = this.dataLength
          if (index <= this.maxnum / 2) {
            this.showList = this.data.slice(0, this.maxnum)
          } else if ((length - index) >= (this.maxnum / 2)) {
            this.showList = this.data.slice(index - this.maxnum / 2, index + (this.maxnum - this.maxnum / 2))
          } else {
            this.showList = this.data.slice(length - this.maxnum, length)
          }
        }
      }
    }
  }
}
