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
    }
  },
  methods: {
    scrollPrev () {
      const containerWidth = this.isHorizontal
        ? this.$refs.navScroll.offsetWidth
        : this.$refs.navScroll.offsetHeight
      const currentOffset = this.isHorizontal
        ? this.getCurrentScrollOffset()
        : this.getCurrentScrollOffset(2)

      if (!currentOffset) return

      let newOffset =
        currentOffset > containerWidth ? currentOffset - containerWidth : 0

      if (this.beginPos !== 0) {
        if (this.beginPos >= 15) {
          this.showList = this.data.slice(this.beginPos - 15, this.beginPos + this.maxnum - 15)
        } else {
          this.showList = this.data.slice(0, this.maxnum)
        }
      }
      this.isHorizontal
        ? this.setOffset(newOffset, 0)
        : this.setOffset(0, newOffset)
    },
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
      if (navWidth - currentOffset <= containerWidth) return

      let newOffset =
        navWidth - currentOffset > containerWidth * 2
          ? currentOffset + containerWidth
          : navWidth - containerWidth

      if (this.beginPos !== 0) {
        if (this.dataLength - this.beginPos >= 15) {
          this.showList = this.data.slice(this.beginPos - this.maxnum + 15, this.beginPos + 15)
        } else {
          this.showList = this.data.slice(this.dataLength - this.maxnum, this.dataLength)
        }
      }

      this.isHorizontal
        ? this.setOffset(newOffset, 0)
        : this.setOffset(0, newOffset)
    },
    scrollToActiveTab () {
      const nav = this.$refs.nav
      const activeTab = this.$el.querySelector('.ml-tab-item-active')
      if (!activeTab) return
      const navScroll = this.$refs.navScroll
      const activeTabBounding = activeTab.getBoundingClientRect()
      const navScrollBounding = navScroll.getBoundingClientRect()
      const maxOffset = this.isHorizontal ? nav.offsetWidth - navScrollBounding.width : nav.offsetHeight - navScrollBounding.height
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
        if (activeTabBounding.top < navScrollBounding.bottom) {
          newOffset =
            currentOffset - (navScrollBounding.top - activeTabBounding.bottom)
        }
        if (activeTabBounding.top > navScrollBounding.bottom) {
          newOffset =
            currentOffset + activeTabBounding.bottom - navScrollBounding.top
        }
      }

      newOffset = Math.max(newOffset, 0)
      this.isHorizontal
        ? this.setOffset(Math.min(newOffset, maxOffset), 0)
        : this.setOffset(0, Math.min(newOffset, maxOffset))
    },
    getCurrentScrollOffset (type = 1) {
      const { navStyle } = this
      return navStyle.transform
        ? type === 1
          ? Number(navStyle.transform.match(/-(\d+(\.\d+)*)px/)[1])
          : Number(navStyle.transform.match(/ -(\d+(\.\d+)*)px/)[1])
        : 0
    },
    setOffset (x, y) {
      this.navStyle.transform = `translate(-${x}px, -${y}px)`
    },
    goBegin () {
      if (this.dataLength > 50) {
        this.showList = this.data.slice(0, this.maxnum)
      }
      this.setOffset(0, 0)
    },
    goEnd () {
      if (this.dataLength > 50) {
        this.showList = this.data.slice(this.dataLength - this.maxnum, this.dataLength)
      }
      const nav = this.$refs.nav
      const navScroll = this.$refs.navScroll
      const navScrollBounding = navScroll.getBoundingClientRect()
      const maxOffset = this.isHorizontal ? nav.offsetWidth - navScrollBounding.width : nav.offsetHeight - navScrollBounding.height
      this.isHorizontal
        ? this.setOffset(maxOffset, 0)
        : this.setOffset(0, maxOffset)
    }
  }
}
