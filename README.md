# cols-drag-react
做一个模拟拖拽的栅格布局组件，模仿webflow的设计

## 使用拖拽来做栅格布局
第一次做这类的拖拽组件，想当然的使用了拖拽来实现栅格拖拽布局，但是最终实现效果差强人意
- 勉强能够使用，但是不易客户使用
- 在拖动的时候，鼠标指针的样式无法修改
- 由于使用拖拽，会导致拖拽元素落入非指定容器内

## 模拟拖拽来做栅格布局
之后使用mousedown, mouseup, mouseup,mousemove来做模拟拖拽
- 使用效果完美
- 缺陷：拖动时相应区域需要自己在拖动时加一层透明面板，响应mousemove, 同时全局监控mouseup,结束拖拽。

## 效果图
![empt](https://github.com/lilongllong/cols-drag-react/blob/master/build/%E5%AF%B9%E6%AF%94%E6%95%88%E6%9E%9C.png?raw=true)

![empt](https://github.com/lilongllong/cols-drag-react/blob/master/build/%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C.png?raw=true)
