+++
title = "使用 std::string_view 替代 const std::string&"
date = "2026-07-05"

[taxonomies]
tags = ["c++", "c++17"]
+++

C++17 中增加了 std::string_view 新特性，表示非占有数据的字符序列。非占有数据如何理解？

主要包含三个关键点：

1. 可以表征字符序列

    C-Style string 和 C++-Style std::string ，都可以用 std:string_view 表示，默认会进行隐式转换。

2. 不占有数据存储空间

    只存储指向原始数据的指针和长度，不会增加数据拷贝的额外负担。

3. 无法对数据进行修改

    你绝对无法修改其数据内容，这也是名字 `view` 的由来之一。如果你需要对字符串进行修改，那就不该使用它。

有了这些特性，仅仅使用 std::string_view 作为函数形参，就可以实现类似常量引用的效果，不再需要额外的 const 和 reference 修饰符。

```cpp
// old
void print_str(const std::string& str) {
    std::cout << str << std::endl;
}

// now
void print_sv(std::string_view sv) {
    std::cout << str << std::endl;
}

```

然和在《Effective C++》中学到的经验告诉我们尽量 pass-by-reference 而不是 pass-by-value ，当然前提是传值的开销远大于参数参数时。那么 std::string_view 实例对象占用了多大空间呢？

在两大开源编译器 g++ 和 clang++ 的实现中，std:string_view 的数据成员仅有两个，一个是指向字符序列的常量指针，另一个是序列大小。

```cpp
// gnu g++
private:
    size_t	    _M_len;
    const _CharT* _M_str;

// llvm clang++
private:
    const_pointer data_;  // exposition only
    size_type     size_;  // exposition only
```

在 64 位机器上，仅占用 128 bit(16 bytes) 的空间。pass-by-value 和 pass-by-reference 的开销相差无几。
 
另外，std::string_view 支持哈希，可以直接在 std::unordered_map 及其他字典容器中作为 key 使用。


# 学习
https://en.cppreference.com/cpp/string/basic_string_view
https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring_view/
https://learnmoderncpp.com/2024/10/29/when-to-use-stdstring_view/
https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n3921.html

