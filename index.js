const install = function (Vue, options) {
  const insertAfter = function (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  let $bodyWrapper = ''

  Vue.directive('head-stick', {
    inserted (el, binding, vnode) {
      const { context } = vnode
      context.$nextTick(_ => {
        el.style.height = 'auto'

        const $tableHead = el.querySelector('.el-table__header-wrapper')
        if (!$tableHead) {
          return
        }
        const $fixedHead = document.createElement('div')
        const $headWrapper = document.createElement('div')
        const $emptyBlock = el.querySelector('.el-table__empty-block')

        $emptyBlock && ($emptyBlock.style.minHeight = '300px')
        $bodyWrapper = el.querySelector('.el-table__body-wrapper')
        $bodyWrapper.style.height = 'auto'
        $fixedHead.className = el.className
        const { left: paddingLeft, width: barWidth } = el.getBoundingClientRect()

        $headWrapper.className = 'fix-head'
        $headWrapper.style.boxSizing = 'border-box'
        $headWrapper.style.width = barWidth + 'px'
        $headWrapper.style.left = paddingLeft + 'px'
        $headWrapper.style.cssText += 'position: fixed; top: 0; display: none; z-index: 2;'

        $fixedHead.appendChild($tableHead.cloneNode(true))
        $headWrapper.appendChild($fixedHead)
        insertAfter($headWrapper, el)

        const scrollHandler = install.scrollHandler = function (e) {
          const { top } = $tableHead.getBoundingClientRect()
          const scrollTop = document.body.scrollTop

          if (scrollTop > top) {
            $headWrapper.style.display = 'block'
          } else {
            $headWrapper.style.display = 'none'
          }

          if ($bodyWrapper.getBoundingClientRect().bottom < 0) {
            $headWrapper.style.display = 'none'
          }
        }

        window.addEventListener('scroll', scrollHandler)

        const cloneHead = $fixedHead.querySelector('.el-table__header-wrapper')

        const bodyScrollHandler = install.bodyScrollHandler = function (e) {
          if ($tableHead) {
            cloneHead.scrollLeft = e.target.scrollLeft
          }
        }

        $bodyWrapper.addEventListener('scroll', bodyScrollHandler)
      })
    },

    unbind (el, binding, vnode) {
      const { scrollHandler, bodyScrollHandler } = install
      window.removeEventListener('scroll', scrollHandler)
      $bodyWrapper.removeEventListener('scroll', bodyScrollHandler)
    }
  })
}

export default install
