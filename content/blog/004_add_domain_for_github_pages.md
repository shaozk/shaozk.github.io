+++
title = "GitHub Pages 使用自己的域名"
description = ""
date = "2026-07-05"

[taxonomies]
tags = ["blog", "github"]
+++

废了老大半天劲，终于在 GitHub Page 上使用上自定义域名 [shaozk.xyz](https://shaozk.xyz/) 了。

下面是踩坑步骤：

## 参考别人博客就能成功

> 这是我按照并成功配置的博客，很棒！
> 之前还参考了其他很多不错的文章，不过当时都没有成功，就不贴链接了吧。

* [【教程】Github Page 添加自定义域名](https://blog.csdn.net/qq_34902437/article/details/140298754)

按照博客中的步骤一步步来就能成功，不过我的域名是在阿里云买的，界面有些不一样，不过原理是想通的。

## 更重要的是学习到做了什么

> DeepSeek

GitHub 提供了一个免费域名 https://shaozk.github.io 和对应的服务器，我要做的事情是将自定义域名映射到服务器上去。

在这之前需要在 GitHub 上进行域名验证，可以理解为这是为了确保你是域名的拥有者。操作方法是在域名上增加一条 TXT 记录，证明你确实拥有该域名的控制权。

可以在谷歌浏览器中 chrome://net-internals/#dns 查看 DNS 解析结果。

## 为什么可行？

不是很理解整个流程，或许就先这样吧。反正已经配置通过了 :)

