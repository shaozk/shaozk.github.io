+++
title = "C++ 最烦人的解析"
date = "2026-07-22"

[taxonomies]
tags = ["c++"]
+++

https://github.com/p-ranav/cgol/blob/master/include/cgol/utils.hpp#L19

```c++

return std::string((std::istreambuf_iterator<char>(stream)), std::istreambuf_iterator<char>());


```

问题：为什么第一个参数需要添加额外的括号？

这是 C++ 中存在的解析歧义问题，可以看下面这一个简单例子，也是我最容易犯的错误：

```c++
class Tmp {
  
};

int main() {
  Tmp t();
  return 0;
}
```

这段代码是有问题的，`Tmp t();` 同时也可以看作函数 t 的声明，无输入参数，返回 Tmp 类型变量。

对于编译器来说，这种歧义是无法解决的。不过在 C++11 及以后，可以通过将 () 替换成 {} 解决： `Tmp t{}`。

将其变得更复杂一点点：

```c++
class Tmp {
  
};

int main() {
  Tmp t(Tmp());
  return 0;
}
```

这也会产生歧义，Tmp() 可以被解释为无名的参数，其参数类型是返回 Tmp 的无参函数。

我们可以继续增将 () 改成 {} 来解决歧义，但是在 C++11 之前，只能通过增加额外括号来解决 `Tmp t((Tmp()));`，括号表达式不会被误以为是参数声明。

至此，问题的答案很明显了，第一个参数添加额外括号是为了防止歧义。

但其实：整个语句中第一个参数就算没有额外的括号，也不会出现歧义。因为 return 关键字确定了后面的语句是对象初始化而不是函数声明。


# 参考
* https://en.wikipedia.org/wiki/Most_vexing_parse
* https://zhuanlan.zhihu.com/p/391558669
