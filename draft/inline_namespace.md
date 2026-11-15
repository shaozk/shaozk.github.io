+++
title = "inline namespace 解决 ABI 兼容问题"
description = "inline namespace 能进行 ABI 版本控制，将问题提前暴露到链接期，而不是等到运行时莫名崩溃。"
date = "2026-10-20"

[taxonomies]
tags = ["c++", "c++11"]
+++

## 什么是 ABI 破坏？

ABI 破坏（ABI break）指新的库或更新破坏了原有的 ABI 导致不兼容。其根本原因是代码修改后，虽然源码层面的 API 没有变（能够正常通过编译链接），但是二进制层面的 ABI 却发生了变动（数据结构、内存布局、符号等），导致新的库文件与旧的可执行文件无法正常协作。

这个问题十分隐蔽且难以排查，不仅程序在编译和链接时都是正常的，而且在运行时会出现数据异常或直接崩溃不同的表现。

## 举一个例子

不妨来从一个简单例子入手，假定有一个 Object 类，包含有两个成员变量 a 和 b，一个成员函数 print()，其声明在 lib.h 文件中，定义在 lib.cpp 文件。

```cpp
// lib.h
class Object {
public:
  void print() const;
  int a;
  int b;
};
```

```cpp
// lib.cpp
#include "lib.h"
#include <iostream>

void Object::print() const {
  std::cout << "[lib]: a=" << a << " b=" << b << std::endl;
}
```

```cpp
// main.cpp
#include "lib.h"
#include <iostream>

int main() {
  Object obj;
  obj.a = 10;
  obj.b = 20;
  std::cout << "[main]: a=" << obj.a << " b=" << obj.b << std::endl;
  obj.print();
  return 0;
}
```

## 如何解决？

最直接的方式当然是整个进行重新编译。

是否还有更好的方法？

## inline namespace

内联命名空间（inline namespace）是 C++11 增加的新特性，作用是将当前子空间直接暴露到上层命名空间，但同时又保留自己独立的空间身份。

文字定义没那么直观，看一个例子就很清楚：

```cpp
namespace lib {
  inline namespace v1 {
    void print();
  }
}
```

这里定义了一个 lib 空间和一个 v1 子空间，并且 v1 为内联。此时可以用以下两种方式调用 print() 函数：

```cpp
lib::v1::print();  // 显示访问
lib::print();  // 直接访问
```

对使用者来说，v1 就好像不存在一样，调用起来方便很多。

但是，既然不想让 v1 存在，那为什么还要费功夫去定义它呢？这里引出了一个历史悠久的 C++ 问题：ABI 破坏。

