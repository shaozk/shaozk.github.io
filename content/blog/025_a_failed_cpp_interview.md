+++
title = "一次失败的 C++ 面试"
description = ""
date = "2026-10-07"

[taxonomies]
tags = ["interview", "c++"]
+++

> 一次 C++ 面试中遇到的题目，令人难忘。但其实《Effective C++》中提到过，只是我忘记罢了：条款37——绝不重新定义继承而来的缺省参数值

## 面试题


```cpp
#include <iostream>

using namespace std;

class Base {
public:
  virtual void print(int a = 5) {
    cout << a << endl;    
  }
};

class Derived : public Base {
public:
  void print(int b = 10) override {
    cout << b << endl;    
  }
};

int main() {
  Base *base = new Derived[10]();
  base[3].print();
  delete [] base;
  return 0;
}
```


### 1. new 一个类对象后的括号能不能省略？

  答案是可以的，对于类类型会调用默认构造函数。


### 2. 代码中打印的结果是啥？

  很明显这里存在继承关系，虚函数 base[3] 实际上是类 Derived 的对象，所以调用的是 Derived::print()，结果会打印 10。

  如果你也是这样想的话，那你就犯错了，面试官心内心 OS：这个人不能给他通过。

  正确答案是打印 5。因为函数缺省参数值是静态绑定的，而 base 的静态类型是指向 Base 的指针，所以默认参数用 Base::print() 中的 5；base 的动态类型是指向 Derived 的指针，所以调用的是 Derived::print()。


### 3. base[3] 在 32 位机器的偏移是多少字节？

  是 3 * sizeof(Base) 而不是 3 * sizeof(Derived)。

  其中：sizeof(Base) = vptr + 数据成员 = 4 + 0 = 4，所以结果是 3 * 4 = 12 字节。


### 4. 代码中有啥潜在问题？

  当前子类也没有任何数据成员，所以恰好没问题。如果存在数据成员的话，其 sizeof(Derived) 和 sizeof(Base) 大小会不一样，导致访问 base[3] 会落到错误的地址。同时 delete[] base 也存在问题。


## 教训

这些问题我都没能答出来，这无疑不暴露我 C++ 基础知识之薄弱。
