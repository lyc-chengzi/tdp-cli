## 组件生成器开发说明

### 1. 以组件type + .com命名，例如 grid.com.js, card.com.js
### 2. 继承NodeBase类
### 3. 实现几个基类方法，方法列表如下：
```
3.1) toString方法    ->    返回的字符串将写入到template模板部分
3.2) toData方法      ->    返回的字符串将写入到data部分
3.3) toMethods方法   ->    返回的字符串将写入到method部分
3.4) toMounted方法   ->    返回的字符串将写入到mounted函数中
```

具体示例可参考grid.com.js实现