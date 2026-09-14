+++
title = "令人困惑的 Python is 语法"
date = "2026-09-06"

[taxonomies]
tags = ["python", "cpython"]
+++

我们知道 Python is 语法是用于判断两个变量是否指向同一个对象，也就是说 is 会在内存层面判断否完全相同，而不仅仅是判断值是否相等。

但是...

## 例外情况

```python
a = 5
b = 5
print(a is b)
```

你可以自己尝试在终端输入一下，看一下结果是什么。

答案是这段代码会打印 True，然而这似乎和 is 的定义不相符合：从语法上看 a 和 b 是两个独立的变量，且值都是不可变对象字面值常量，其内存地址应该是不一样的才对。

这究竟是为什么呢？

## 开始 AI

> DeepSeek:
> CPython 的小整数缓存机制，本质上是 “用空间换时间” 的优化策略：预先创建一批高频使用的小整数对象，让它们在整个解释器生命周期内被共享，避免重复创建和销毁。
> 缓存范围：不对称的 [-5, 256]

本地测试确实是如此，在 -5 到 256 的左闭右闭区间内的整数，都会产生上文提到的例外情况。而只要超出这个范围，就变“正常”了。

问题找到答案了，这是 Python 实现机制上的一个技巧，只要记住这个特性就好了。但结果真的是这样吗？

## 源码之前，了无秘密

为了加深映像，我决定查看一下 CPython 的源码实现。

```c
// https://github.com/python/cpython/blob/main/Include/internal/pycore_runtime_structs.h
#define _PY_NSMALLPOSINTS           1025
#define _PY_NSMALLNEGINTS           5

struct _Py_static_objects {
    struct {
        /* Small integers are preallocated in this array so that they
         * can be shared.
         * The integers that are preallocated are those in the range
         * -_PY_NSMALLNEGINTS (inclusive) to _PY_NSMALLPOSINTS (exclusive).
         */
        PyLongObject small_ints[_PY_NSMALLNEGINTS + _PY_NSMALLPOSINTS];

        /* ... */
    } singletons;
};

#define _Py_GLOBAL_OBJECT(NAME) \
    _PyRuntime.static_objects.NAME
#define _Py_SINGLETON(NAME) \
    _Py_GLOBAL_OBJECT(singletons.NAME)


#define _PyLong_SMALL_INTS _Py_SINGLETON(small_ints)


static PyObject *
get_small_int(sdigit ival)
{
    assert(IS_SMALL_INT(ival));
    return (PyObject *)&_PyLong_SMALL_INTS[_PY_NSMALLNEGINTS + ival];
}

```
可以看到当值为小整数时，会直接通过 ival + 5 从预先分配好的数组中拿取数据，这也就是小整数共享内存的原因。


## 跟 AI 说的有点不一样？

等等，为啥上限值是 1025 而不是 257？最新的 CPython 已经准备将小整数范围修改为 [-5, 1024] 了。

> Gemini
> Python 3.13（当前稳定版） / Python 3.14（即将发布）：没有包含此修改。它们的 _PY_NSMALLPOSINTS 依然是旧的 257，小整数池仍为 [-5, 256]。
> Python 3.15（开发中版本）：已纳入。这个修改直接合并在 main 开发分支上。按照 Python 每年一个次要版本的发布节奏，包含此变动的 Python 3.15 正式版预计将于 2026 年 10 月左右发布。

现在的时间是 2026 年 9 月 14 号，如果我不去看看源码的话，我想很难知道最新的情况。

## 如何避免

在判断值是否相等的时候不使用 is，而是使用 ==（也应该这么做）。


## 另外的一种情况

```python
a = True
b = True
print(a is b)
```

其答案也是 True，看上去（表现）和小整数一样，但其底层原理却不相同，这里不展开。

## 参考
* [How often does Python allocate?](https://zackoverflow.dev/writing/how-often-does-python-allocate)




