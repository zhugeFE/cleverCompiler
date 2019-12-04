import { dom } from '../utils'

const nodeList = []
const mouseDownHandle = function(event) {
  event = event || window.event
  const target = event.target
  for (let item of nodeList) {
    if (!item.node.contains(target)) {
      item.handle.call(item.context)
    }
  }
}

dom.on(document, 'mousedown', mouseDownHandle)

export default {
  bind(el, binding, vnode) {
    nodeList.push({
      node: el,
      handle: binding.value,
      context: vnode
    })
  },
  unbind(el, binding, vnode) {
    const current = {
      node: el,
      handle: binding.value,
      context: vnode
    }
    for (let i in nodeList) {
      var node = nodeList[i]
      if (current.node === node.node) {
        nodeList.splice(i, 1)
        break
      }
    }
  }
}
