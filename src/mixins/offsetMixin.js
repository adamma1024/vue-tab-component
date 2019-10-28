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
      let end = this.endTab

      const currentOffset = this.isHorizontal
        ? this.getCurrentScrollOffset()
        : this.getCurrentScrollOffset(2)

      if (!currentOffset && this.beginPos === 0) return

      const beginIndex = (this.beginPos - (this.endTab.index - this.beginTab.index)) > 0
        ? this.beginPos - (this.endTab.index - this.beginTab.index)
        : 0
      this.showList = this.data.slice(beginIndex, beginIndex + this.maxnum)

      // 剩下逻辑放进nextTick异步中，这样数据已经渲染结束了。再做位移偏转操作
      this.$nextTick(() => {
        const oldEndBound = document.getElementById(`ml-tab-${end.index}`).getBoundingClientRect()
        const newEndBound = document.getElementById(`ml-tab-${this.endTab.index}`).getBoundingClientRect()
        const newOffset = this.isHorizontal ? newEndBound.left - oldEndBound.left : newEndBound.top - oldEndBound.top
        this.isHorizontal
          ? this.setOffset(newOffset, 0)
          : this.setOffset(0, newOffset)
      })
    },

    /**
     * old showList 中的 beginTab.index（endTab.index-(endTab.index-beginTab.index)） 应该出现在新 showList 的首位
     * offset = newShowList[newBegin.index].boundLeftOrTop - newShowList[oldBegin.index].boundLeftOrTop
     */
    scrollNext () {
      // 保存初始的end，因为更新数据后会变动
      let begin = this.beginTab
      let end = this.endTab

      const navWidth = this.isHorizontal
        ? this.$refs.nav.offsetWidth
        : this.$refs.nav.offsetHeight
      const containerWidth = this.isHorizontal
        ? this.$refs.navScroll.offsetWidth
        : this.$refs.navScroll.offsetHeight
      const currentOffset = this.isHorizontal
        ? this.getCurrentScrollOffset()
        : this.getCurrentScrollOffset(2)
      if (navWidth + currentOffset <= containerWidth) return

      if (this.beginPos !== this.maxBegin) {
        // 数据发生变动，offset改变需在数据变动之后计算
        const beginIndex = (this.beginPos + this.endTab.index - begin.index) > this.maxBegin
          ? this.maxBegin
          : this.beginPos + this.endTab.index - begin.index
        this.showList = this.data.slice(beginIndex, beginIndex + this.maxnum)
        // 剩下逻辑放进nextTick异步中，这样数据已经渲染结束了。再做位移偏转操作
        this.$nextTick(() => {
          const oldBeginBound = document.getElementById(`ml-tab-${begin.index}`).getBoundingClientRect()
          const newBeginBound = document.getElementById(`ml-tab-${this.beginTab.index}`).getBoundingClientRect()
          const newOffset = this.isHorizontal ? newBeginBound.left - oldBeginBound.left : newBeginBound.top - oldBeginBound.top
          this.isHorizontal
            ? this.setOffset(newOffset, 0)
            : this.setOffset(0, newOffset)
        })
      } else {
        // 数据没发生改变，直接移动 offset = end.boundLeftOrTop - begin.boundLeftOrTop
        const endBound = document.getElementById(`ml-tab-${end.index}`).getBoundingClientRect()
        let offset
        if (this.isHorizontal) {
          offset = this.$refs.nav.getBoundingClientRect().left - endBound.left
          offset = navWidth + offset < containerWidth ? containerWidth - navWidth : offset
          this.setOffset(offset, 0)
        } else {
          offset = this.$refs.nav.getBoundingClientRect().top - endBound.top
          offset = navWidth + offset < containerWidth ? containerWidth - navWidth : offset
          this.setOffset(0, offset)
        }
      }
    },

    /**
     * 滚动到active状态的tab
     */
    scrollToActiveTab () {
      this.changeShowList(!this.currActive && this.data[0] ? this.data[0].key : this.currActive)
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
          ? Number(navStyle.transform.match(/[-\d]*\.?\d+/)[0])
          : Number(navStyle.transform.match(/[-\d]*\.?\d+/)[1])
        : 0
    },
    /**
     * 设置offset
     * @param {*} x 横向offset
     * @param {*} y 纵向offset
     */
    setOffset (x, y) {
      this.navStyle.transform = `translate(${x}px, ${y}px)`
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
