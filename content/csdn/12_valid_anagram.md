+++
title = "有效的字母异位词"
date = "2024-11-26"

[taxonomies]
tags = ["leetcode"]
+++

## 一 问题描述

给定两个字符串 `s` 和 `t` ，编写一个函数来判断 `t` 是否是 `s` 的字母异位词。字母异位词是指通过重新排列不同单词或短语的字母而形成的单词或短语，并使用所有原字母一次。

原题链接： [242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/) 

---

## 二 解决方法

### 1 排序法

#### 分析

按照字母异位词的定义可知：如果两个字符串属于字母异位词，那么将两者排序后，其字符串必相同。

#### 代码

```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        sort(s.begin(), s.end());			// 排序s
        sort(t.begin(), t.end());			// 排序t
        return s == t;						// 比较s和t是否相等
    }
};
```

#### 复杂度

- 时间复杂度： `O(nlogn)` ，即快速排序长度为 `n` 的字符串的时间复杂度。

- 空间复杂度： `O(logn)` ，即快速排序长度为 `n` 的字符串的空间复杂度。

### 2哈希表

#### 分析

对比字符串中每个字母的使用次数，同样可以判断二者是否是字母异位词。正好可以字母为键、使用次数为值的哈希表作为数据结构。

因为字母仅有 `26` 个小写字母组成，不妨将其映射到数值 `0～25` ，这样的话可直接使用数组存储哈希表。

#### 代码

```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        int sLen = s.size();						// 获取字符串s的长度
        int tLen = t.size();						// 获取字符串t的长度
        if (sLen != tLen) {							// 如果两者长度不一致
            return false;							// 直接返回false
        }	
        int table[26] = {0};						// 初始化哈希表为0
        for (int i = 0; i < sLen; ++i) {			// 遍历字符串s
            ++table[s.at(i) - 'a'];					// 构建哈希表
        }
        for (int i = 0; i < tLen; ++i) {			// 遍历字符串t
            if (--table[t.at(i) - 'a'] < 0) {		// “析构”哈希表，且如果发现计数小于0（说明字母出现次数不匹配）
                return false;						// 返回false
            }
        }

        return true;								// 返回true

    }
};
```

#### 复杂度

- 时间复杂度： `O(n)` ，遍历长度为 `n` 的字符串.

- 空间复杂度： `O(26)` ， `26` 个小写字母

---

## 三 总结

- 使用特定字作为键的哈希表可以转换为用数组存储。

---
