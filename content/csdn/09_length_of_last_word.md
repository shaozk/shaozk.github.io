+++
title = "最后一个单词长度"
date = "2024-11-11"

[taxonomies]
tags = ["leetcode"]
+++

## 一 问题描述

给定一个字符串 `s` ，由若干单词组成，单词前后有一些空格字符隔开。返回字符串中最后一个单词的长度。

[58. 最后一个单词的长度](https://leetcode.cn/problems/length-of-last-word/) 

---

## 二 解决方法

### 1 逆序遍历

#### 分析

初始化最后一个单词长度 `length = 0` ，逆序遍历数组，累加 `length` ，直到找到第一个为空格字符的元素。此时 `length` 即为所求值。值得注意的是：字符串末尾可能含有空格字符，需先清除它们，再开始计数单词长度。

#### 代码

```cpp
class Solution {
public:
    int lengthOfLastWord(string s) {
        int length = 0, start = s.size() - 1;				// 初始化最后一个单词长度为0，逆序下标为n-1
        while (start >= 0 && s.at(start) == ' ') {			// 如果存在末尾空格，清除它们（跳过）
            --start;										// 更新下标
        }
        while (start >= 0 && s.at(start) != ' ') {			// 循环直到找到空格字符
            ++length;										// 单词长度+1
            --start;										// 更新下标
        }
        return length;										// 返回单词长度
    }
};
```

#### 复杂度

- 时间复杂度： `O(n)` ，遍历（逆序）长度为 `n` 的数组一次。

- 空间复杂度： `O(1)` ，常数个变量。

## 三 总结

- 正序遍历不好解决问题时，不妨考虑逆序遍历。

---
