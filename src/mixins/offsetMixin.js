export default {
  data () {
    return {
      navStyle: {
        transform: ''
      }
    }
  },
  watch: {
    tabPosition (val, old) {
      if (
        (
          old !== 'left' &&
          old !== 'right' &&
          (val === 'left' || val === 'right')
        ) ||
        (
          old !== 'top' &&
          old !== 'bottom' &&
          (val === 'top' || val === 'bottom')
        )
      ) {
        this.goBegin()
      }
      if ((val === 'left' || val === 'right') && this.type !== 'card') {
        this.tabPosition = 'bottom'
      }
    }
  },
  methods: {
    /**
     * 向前滚动
     * 取可视区首个元素，在数据中定位，数据向前取 6 个值
     * nextTick 中 获取老的begin元素的bound x width
     * setOffset 移动begin至可视区尾部
     * 移动尾部算法，新尾部元素 bound 减去begin的bound的值
     */
    scrollPrev () {
      // 保存初始的begin，因为更新数据后会变动
      let begin = this.beginTab

      const currentOffset = this.isHorizontal
        ? this.getCurrentScrollOffset()
        : this.getCurrentScrollOffset(2)

      if (!currentOffset && this.beginPos === 0) return

      const beginIndex = (this.beginPos - 6) > 0 ? this.beginPos - 6 : 0
      const endIndex = (this.beginPos - 6) > 0 ? this.beginPos + this.maxnum - 6 : this.maxnum
      this.showList = [...this.data.slice(beginIndex, endIndex)]

      // 剩下逻辑放进nextTick异步中，这样数据已经渲染结束了。再做位移偏转操作
      this.$nextTick(() => {
        const newOffset = this.endTab.boundLeftOrTop - begin.boundLeftOrTop > 0 ? this.endTab.boundLeftOrTop - begin.boundLeftOrTop : 0
        this.isHorizontal
          ? this.setOffset(newOffset, 0)
          : this.setOffset(0, newOffset)
      })
    },
    /**
     * 向后滚动
     */
    scrollNext () {
      const navWidth = this.isHorizontal
        ? this.$refs.nav.offsetWidth
        : this.$refs.nav.offsetHeight
      const containerWidth = this.isHorizontal
        ? this.$refs.navScroll.offsetWidth
        : this.$refs.navScroll.offsetHeight
      const currentOffset = this.isHorizontal
        ? this.getCurrentScrollOffset()
        : this.getCurrentScrollOffset(2)
      if (navWidth - currentOffset <= containerWidth && this.showList[this.showList.length - 1].id === this.data[this.dataLength - 1].id) return

      this.showList = [...this.data.slice(this.beginPos + 5, this.beginPos + this.maxnum + 5)]
      const newOffset = currentOffset + 30

      this.isHorizontal
        ? this.setOffset(newOffset, 0)
        : this.setOffset(0, newOffset)
    },
    /**
     * 滚动到active状态的tab
     */
    scrollToActiveTab () {
      this.changeShowList(!this.currActive && this.data[0] ? this.data[0].id : this.currActive)
      this.$nextTick(() => {
        const nav = this.$refs.nav
        const activeTab = this.$el.querySelector('.ml-tab-item-active')
        if (!activeTab) return
        const navScroll = this.$refs.navScroll
        const activeTabBounding = activeTab.getBoundingClientRect()
        const navScrollBounding = navScroll.getBoundingClientRect()
        let maxOffset = this.isHorizontal ? nav.offsetWidth - navScrollBounding.width : nav.offsetHeight - navScrollBounding.height
        if (maxOffset < 0) {
          maxOffset = 0
        }
        const currentOffset = this.isHorizontal
          ? this.getCurrentScrollOffset()
          : this.getCurrentScrollOffset(2)
        let newOffset = currentOffset

        if (this.isHorizontal) {
          if (activeTabBounding.left < navScrollBounding.left) {
            newOffset =
              currentOffset - (navScrollBounding.left - activeTabBounding.left)
          }
          if (activeTabBounding.right > navScrollBounding.right) {
            newOffset =
              currentOffset + activeTabBounding.right - navScrollBounding.right
          }
        } else {
          if (activeTabBounding.top < navScrollBounding.top) {
            newOffset =
              currentOffset - (navScrollBounding.top - activeTabBounding.top)
          }
          if (activeTabBounding.bottom > navScrollBounding.bottom) {
            newOffset =
              currentOffset + activeTabBounding.bottom - navScrollBounding.bottom
          }
        }

        newOffset = Math.max(newOffset, 0)
        this.isHorizontal
          ? this.setOffset(Math.min(newOffset, maxOffset), 0)
          : this.setOffset(0, Math.min(newOffset, maxOffset))
      })
    },
    /**
     * 根据当前是横向还是纵向，获得当前offset
     * @param {*} type 1：横向 2：纵向
     */
    getCurrentScrollOffset (type = 1) {
      const { navStyle } = this
      return navStyle.transform
        ? type === 1
          ? Number(navStyle.transform.match(/-(\d+(\.\d+)*)px/)[1])
          : Number(navStyle.transform.match(/ -(\d+(\.\d+)*)px/)[1])
        : 0
    },
    /**
     * 设置offset
     * @param {*} x 横向offset
     * @param {*} y 纵向offset
     */
    setOffset (x, y) {
      this.navStyle.transform = `translate(-${x}px, -${y}px)`
    },
    /**
     * 移动到最开始的位置
     */
    goBegin () {
      if (this.dataLength > this.maxnum) {
        this.showList = this.data.slice(0, this.maxnum)
      }
      this.$nextTick(() => {
        this.setOffset(0, 0)
      })
    },
    /**
     * 移动到结束的位置
     */
    goEnd () {
      if (this.dataLength > this.maxnum) {
        this.showList = this.data.slice(this.dataLength - this.maxnum, this.dataLength)
      }
      this.$nextTick(() => {
        const nav = this.$refs.nav
        const navScroll = this.$refs.navScroll
        const navScrollBounding = navScroll.getBoundingClientRect()
        let maxOffset = this.isHorizontal ? nav.offsetWidth - navScrollBounding.width : nav.offsetHeight - navScrollBounding.height
        if (maxOffset < 0) {
          maxOffset = 0
        }
        this.isHorizontal
          ? this.setOffset(maxOffset, 0)
          : this.setOffset(0, maxOffset)
      })
    }
  }
}
