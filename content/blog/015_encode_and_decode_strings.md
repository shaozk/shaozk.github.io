+++
title = "编码和解码字符串"
date = "2026-08-02"

[taxonomies]
tags = ["neetcode", "cpp"]
+++

题目：实现字符串数组到字符串的序列化和反序列化方法，使得输入的字符串数组经过一次编码和一次解码后，仍和原来保持一致。

```cpp
string encode(vector<string>& strs) {}

vector<string> decode(string s) {}  
```

# 题解

遍历字符串数组，计算每个元素的长度，增加到字符串开头，并增加一个特殊界定符，用于隔开长度和原始字符串：`str.size() + '#' + str`。

字符串中出现了 '#' 符号会不会有影响？

答案是不会，关键在于 '#' 第一次出现的位置，这是可以确定的，然后将位置左边的内容解析为长度值，位置往右数长度值个字符的内容解析为原始字符串。

看一个例子就比较清晰了：

```
5 # h e # # o 5 # w o r l d
  ^             ^
  首个 # 位置   
```

找到首个 # 位置，解析长度为 5 ，往 # 位置后数 5 个字符，解析字符串为 "he##o"。也就是说，原始字符串中存在 # 符号也不会有任何影响，会被完整解析为字符串。

依此类推直到最后一个字符串。这里需要使用的一个技巧是：解析完第一个字符串后，将这部分内容删除，使得解析后续字符串都如同首个一样。

# 代码
  
```cpp
string encode(vector<string>& strs) {
    string ret = "";
    for (string str : strs) {
        ret += to_string(str.length()) + "#" + str; 
    }
    return ret;
}

vector<string> decode(string s) {
    vector<string> ret = {};
    while (!s.empty()) {
        if (s.find("#") != string::npos) {
            int pos = s.find("#");
            size_t len = stoi(s.substr(0, pos));
            ret.push_back(s.substr(pos + 1, len));
            s.erase(0, s.substr(0, pos).length() + 1 + len);
        }
    }
    return ret;
}
```

# 历程

相较于其他算法题，这更像是一个程序员日常需要解决的工程问题。

一上来没想那么多，直接使用逗号分隔符号连接字符串数组。很明显，这种方法不能通过测试用例包含逗号分隔符的情况，失败。

查看提示，了解到可以通过记录字符串长度进行标识，如何记录字符串长度信息成为关键。但我马上又遇到新的问题；长度本身也占不定长度字符，不好解析。

再次审题，发现每个字符串的长度不会超过 200，也就是说三位数字就足以存储所有可能的字符串（不满三位时补充0）。在解析字符串时，前三位固定为长度值，紧接着为原始字符串。很幸运，通过测试。

反思，但如果字符串是任意长度，代码就不适应了。查看答案，发现只要在长度和字符串之间增加一个特定符号就可以解决。妙！


# 链接

* https://neetcode.io/problems/string-encode-and-decode/question
