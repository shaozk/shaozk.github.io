+++
title = "使用 tabi 创建你的 Github Pages"
date = "2026-06-18"

[taxonomies]
tags = ["tabi"]
+++

最近在网上看到一个博客主题很不错，于是拿来配置我的个人主页。

博客主题叫 tabi，仓库地址为：https://github.com/welpo/tabi。这是主题的源代码，
除此之外，作者还贴心为你准备了一个快速开始样例：https://github.com/welpo/tabi-start 。

## 快速开始

因为 tabi 是基于 Zola 实现的，所以只需在克隆代码后执行：

```
$ cd tabi-start
$ zola serve
```

就可以在本地启动站点，默认网址是：http://127.0.0.1:1111


## 整合到 Github Pages

因为 Github Pages 原生是不支持 zola 的，所以你需要单独创建一个 Actions 。
官方贴心为你准备了方法：https://github.com/getzola/github-pages 。

值得注意的是：在增加完部署 zola 的 action.yml 文件后，记得在 Github 仓库设置
替换默认的部署方式。


## 总结

配置下来我的感觉是：好方便，比 jekyll 那一套好用多了，后续我就使用这个不再折腾了吧。
