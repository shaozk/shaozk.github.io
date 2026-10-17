+++
title = "和为 K 的子数组"
description = ""
date = "2026-10-09"

[taxonomies]
tags = ["leetcode", "c++"] 
+++

## 问题描述

给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

子数组是数组中元素的连续非空序列。

## 暴力法

枚举所有子数组情况，对其进行求和，很轻松可以找到和为 K 的子数组并统计次数。

```cpp
int subarraySum(vector<int>& nums, int k) {
    int n = nums.size(), ret = 0;
    for (int i = 0; i < n; ++i) {
        int sum = 0;
        for (int j = i; j < n; ++j) {
            sum += nums[j];
            if (sum == k) {
                ret++;
            }
        }
    }
    return ret;
}
```

时间复杂度：O(n^2)
空间复杂度：O(1)

## 前缀和+哈希

实际上我们不用每次都重新计算子数组的和，可以观察到：子数组的和可以前缀和快速算出来，不用每次重新累加。

我们记录子数组前缀和为 pre[i]，此时查询条件变成了找到满足 pre[j] - pre[i] == k (i <= j) 的元素对个数。

调换一下顺序：pre[i] = pre[j] - k，也就是说只要知道有多少一个 pre[i] 使得等式满足条件，就相当于有多少个子数组满足条件。

这样子我们就可以用一个字典记录前缀和及次数，边遍历边查询历史，直到遍历完整个数组。此时，只需要遍历一次。


```cpp
int subarraySum(vector<int>& nums, int k) {
    int n = nums.size(), ret = 0;
    unordered_map<int, int> dict;
    dict[0] = 1;
    int pre = 0;
    for (auto x : nums) {
        pre += x;
        if (dict.find(pre - k) != dict.end()) {
            ret += dict[pre - k];
        }
        dict[pre]++;
    }
    return ret;
}

```
时间复杂度：O(n)
空间复杂度：O(n)
