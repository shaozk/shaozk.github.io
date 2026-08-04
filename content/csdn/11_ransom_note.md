+++
title = "赎金信"
date = "2024-11-19"

[taxonomies]
tags = ["leetcode"]
+++

## 一 问题描述

给定两个字符串： `ransomNote` 和 `magazine` ，判断 `ransomNote` 能不能由 `magazine` 里面的字符构成。其中 `magazine` 中的每个字符只能在 `ransomNote` 中使用一次，且 `ransomNote` 和 `magazine` 均由小写字母组成。

原题链接： [383. 赎金信](https://leetcode.cn/problems/ransom-note/) 

---

## 二 解决方法

### 1哈希表

#### 分析

判断字符串ransomNote是否能由另一字符串magazine中的元素构成，只需要满足字符串magazine中每个元素的次数都大于等于ransomNote中相同元素的统计次数即可。所以该问题的关键是统计字符串所包含的全部元素以及元素的出现次数，并以一种合理的方式存储它们。

已知元素只有小写字母组成，次数可以直接用整数表示，使用以字符为键、整形为值的哈希表存储，不管是构建还是使用都十分方便。

易知：字符串ransomNote的必须小于字符串magazine的长度。

#### 代码

```cpp
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        int n = ransomNote.size(), m = magazine.size();		// 获取字符串长度
        if (n > m) {										// ransomNote长度大于magazine长度
            return false;									// 不满足条件，直接返回false
        }        
        unordered_map<char, int> table(0);					// 初始化哈希表为零（零表示该字符不存在）
        for (int i = 0; i < m; ++i) {						// 遍历magazine，构建哈希表
            ++table[magazine.at(i)];						// 该元素对应次数累加
        }
        for (int i = 0; i < n; ++i) {						// 遍历ransomNote字符串
            if (--table[ransomNote.at(i)] < 0) {			// 出现一次字符，对应哈希表减一
                return false;								// 出现小于0（代表字符不够），直接返回false
            }

        }
        return true;										// 返回true
    }   
};
```

#### 复杂度

- 时间复杂度： `O(m+n)` ，即两个字符串的长度和

- 空间复杂度： `O(26)` ，即 `26` 个小写英文字符

### 2数组哈希表

#### 分析

已知哈希表中键只由 `26` 个小写英文字母 `a~z` 组成，易将其映射到 `0~25` ，因此可以用数组作为哈希表的实现方式。

#### 代码

```cpp
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        int table[26] = {0};								// 初始化数组哈希表为0
        int n = ransomNote.size(), m = magazine.size();		// 获取两字符串长度
        if (n > m) {										// ransomNote长度大于magazine长度
            return false;									// 不满足条件，直接返回false
        }   
        for (int i = 0; i < m; ++i) {						// 遍历magazine，构建数组哈希表
            ++table[magazine.at(i) - 'a'];					// 数组哈希表对应元素值加1
        }
        for (int i = 0; i < n; ++i) {						// 遍历ransomNote
            if (--table[ransomNote.at(i) - 'a'] < 0) {		// 数组哈希表对应元素减1
                return false;								// 出现小于0，直接返回false
            }

        }
        return true;										// 返回true
    }   
};
```

#### 复杂度

同上

---

## 三 总结

- 哈希表并不一定要使用专门的数据结构，也可以用数组实现。

---
