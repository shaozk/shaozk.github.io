+++
title = "Python 可变默认参数陷阱"
date = "2026-07-07"

[taxonomies]
tags = ["python"]
+++

> 无意中刷到的「码农高天」的 Python 视频，尝试一下自己也踩坑了。

示例代码如下：

```python
class Player:
    def __init__(self, name: str, items: list = []):
        self.name = name
        self.items = items

a = Player("A")
b = Player("B")

a.items.append("hello")
b.items.append("world")

print(a.items)
print(b.items)
  
```
请问终端打印结果是什么？

我下意识给出的答案，包括身边的朋友也是：

```
['hello']
['world']
```

而正确的答案是：

```
['hello', 'world']
['hello', 'world']
```

什么原理？

Python 中函数的默认参数，只会被创建一次。也就是说所有使用该默认参数的函数调用，都会共享这个默认值。

如果参数是不可变的，这没有影响。但如果参数可变（mutable），那就会掉进如上这类陷阱。

修复方法比较简单，将默认参数 `[]` 修改为 `None` 。


```python
class Player:
    def __init__(self, name: str, items: list = None):
        self.name = name
        if items is None:
            self.items = []
        else:
            self.items = items
```

那么为什么要这样设计呢？

1. 一次创建，多次使用。减少创建重复的对象，提高性能
2. 提供类似静态变量功能，保持状态


[video](https://www.bilibili.com/video/BV1NP4y1g7CT?vd_source=c879317db216a66b04538be69b7cc5b5)
