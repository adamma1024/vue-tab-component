export default {
  props: {
    maxnum: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      showList: this.data.length <= this.maxnum ? this.data : this.data.slice(0, this.maxnum)
    }
  },
  watch: {
    'data.length' () {
      this.updataShowList()
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
          let length = this.data.length - 1
          if (index <= this.maxnum / 2) {
            this.showList = this.data.slice(0, this.maxnum)
          } else if (length - index >= this.maxnum / 2) {
            this.showList = this.data.slice(index - this.maxnum / 2, index + (this.maxnum - this.maxnum / 2))
          } else {
            this.showList = this.data.slice(length - this.maxnum + 1, length + 1)
          }
        }
      }
    }
  }
}
