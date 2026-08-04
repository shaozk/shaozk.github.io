+++
title = "合并两个有序数组"
date = "2024-11-09"

[taxonomies]
tags = ["leetcode"]
+++

## 一 问题描述

给定两个非递减顺序的数组 `num1` 和 `nums2` ，和另两个表示其有效元素个数的整数 `m` 和 `n` 。其中 `nums1` 实际长度为 `m+n` ， `nums2` 实际长度为 `n` ，请合并 `nums2` 到 `nums1` 中去，且合并后的数组 `nums1` 仍保持非递减顺序。注意： `nums1` 前 `m` 个元素表示其有效元素，后 `n` 个元素为 `0` 。

[88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/) 

---

## 二 解决方法

### 1 排序法

#### 分析

直接合并两个数组，然后排序。

#### 代码

- 将数组 `nums2` 拼接至 `nums1` 后半部分

- 非递减排序 `nums1`

```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        for (int i = 0; i < n; ++i) {				// 遍历nums2
            nums1[m + i] = nums2[i];				// 将nums2中元素挪至nums1后半部分
        }
        sort(nums1.begin(), nums1.end());			// 非递减排序nums1
    }
};
```

#### 复杂度

时间复杂度为 `O((m+n)log(m+n))` ，空间复杂度为 `O(log(m+n))` ，即快速排序长度为 `m+n` 数组的复杂度。

### 2 双指针

#### 分析

因为数组 `nums1` 和 `nums2` 本是有序数组，因此使用双指针很容易获得二者结合的有序序列：从前往后遍历两数组，取二者元素的较小者，顺序放入结果数组；或从后往前遍历两数组，取二者元素的较大者，逆序放入结果数组。

我们本需要额外分配 `m+n` 的空间来存放结果数组，但 `nums1` 已在数组末尾分配好额外大小为 `n` 的空间。此时可发现，使用从后往前的遍历方法，无需考虑覆盖数组 `nums1` 元素的问题，也无需分配额外空间。

#### 代码

- 初始化两指针 `left` 和 `right` 分别指向 `nums1` 和 `nums2` 的有效末尾元素，再初始化一指针 `cur` 指向 `nums1` 实际末尾元素

- 遍历 `nums1` 和 `nums2` 直到完成其中一个

- 拷贝 `left` 和 `right` 指向元素的较大者至 `cur` ，更新指针

- 遍历完后，拷贝 `nums2` 剩余（如果存在）至 `nums1`

- 注：无需考虑 `nums1` 存在剩余的情况

```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int left = m - 1, right = n - 1;				// 指向nums1、nums2末尾有效元素的指针left、right
        int cur = m + n - 1;							// 指向nums1末尾的指针cur
        while (left >= 0 && right >= 0) {				// 遍历nums1和nums2直到其中一个完成
            if (nums1[left] >= nums2[right]) {			// 取其中较大者存入位置cur
                nums1[cur] = nums1[left];
                --left;
            } else {
                nums1[cur] = nums2[right];
                --right;
            }
            --cur;										// 更新cur
        } 
        while (right >= 0) {							// 完成nums2剩余遍历（如果需要）
            nums1[cur--] = nums2[right--];
        }
        												// 注：无需考虑num1的剩余遍历
    }
};
```

#### 复杂度

- 最坏情况下，指针移动 `m+n` 次（ `nums1` 的最小元素大于 `nums2` 的最大元素），时间复杂度为 `O(m+n)`

- 数组原地操作，空间复杂度为 `O(1)`

---

### 三 总结

- 当需要原地操作数组时，考虑双指针法以有效提升时间和空间复杂度。

---

​
