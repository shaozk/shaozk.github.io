+++
title = "两数之和—输入有序数组"
date = "2024-12-29"

[taxonomies]
tags = ["leetcode"]
+++

## 一 问题描述

给你一个下标从 `1` 开始的整数数组 `numbers` ，该数组已按非递减顺序排列，请你从数组中找到满足相加之和等于目标数 `target` 的两个数。如果社这两个数分别是 `numbers[index1]` 和 `numbers[index2]` ，则 `1<=index1<index2<=numbers.length` 。

以长度为 `2` 的整数数组 `[index1,index2]` 的形式返回这两个整数的下标 `index1` 和 `index2` 。

可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。

你所设计的解决方案只使用常量级的额外空间。

原题链接： [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/) 

---

## 二 解决方法

### 1 暴力法

#### 分析

因为需要查询两个值，马上可以想到使用两层遍历来分别查询结果。对于第一层循环，需要整个遍历数组，因为任何一个元素都有可能是结果之一；假定其中一个值下标为 `index1` ，则可以在剩下的数组中查找值为 `target-numbers[index1]` 的元素，其下标值即为需要查找的 `index2` 。

由题意已知数组已排序，可使用二分查找法提高查询速度。

#### 代码

```cpp
class Solution {
public:
    int find(vector<int>& vec, int left, int right, int n) {		// 二分查找
        int ret = -1;
        int mid = 0;
        while (left < right) {
            mid = (left + right) / 2;
            if (vec.at(mid) == n) {
                ret = mid;
                break;
            } else if (vec.at(mid) > n) {
                right = mid;
            } else {
                left = mid + 1;
            }
        } 
        return ret;
    }

    vector<int> twoSum(vector<int>& numbers, int target) {
        int idx1 = 0, idx2 = 0;
        int num = numbers.size();
        for (idx1 = 0; idx1 < num; ++idx1) {		// 遍历数组
            idx2 = find(numbers, idx1 + 1, num, target - numbers.at(idx1));	// 二分查找
            if (idx2 != -1) {	
                break;					// 找到直接终止循环
            }
        }
        return {idx1 + 1, idx2 + 1};
    }
};
```

#### 复杂度

- 时间复杂度： `O(logn)` ，遍历第一个元素需要 `O(n)` 时间，查找第二个元素需要 `O(logn)` 时间；二者结合 `O(nlogn)`

- 空间复杂度： `O(1)` ，只使用常量空间。

### 2 双指针

#### 分析

已知结果唯一且数组有序，因此可以设定两个指针分别指向数组的首尾，指针从两头往中间靠拢，直到找到满足条件的结果。当两指针指向元素和为结果值，返回结果；当元素和小于结果值，更新左指针（++）；当元素和大于结果值，更新右指针（–）。

#### 代码

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int idx1 = 0, idx2 = numbers.size() - 1;		// 定义指向首尾的指针
        while (idx1 < idx2) {							// 遍历数组
            auto sum = numbers.at(idx1) +  numbers.at(idx2);	// 计算两数和
            if (sum == target) {						// 判断是否是目标值
                break;
            } else if (sum > target) {					// 判断是否比目标值大
                --idx2;									// 更新idx2
            } else {									// 判断是否比目标值小
                ++idx1;									// 更新idx1
            }
        } 
        return {idx1 + 1, idx2 + 1};					// 返回结果数组（需要替换为从1开始的下标）
    }
};
```

#### 复杂度

- 时间复杂度： `O(n)` ，双指针移动的总次数不超过 `n`

- 空间复杂度： `O(1)` ，常量空间使用。

---

## 三 总结

- 当需要在有序数组上进行查询操作时，二分查找是个不错的选择。

- 双指针法也适合在有序数组上使用。

---
