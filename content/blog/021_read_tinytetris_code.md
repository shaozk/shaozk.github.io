+++
title = "tinytetris 源码阅读"
date = "2026-08-20"

[taxonomies]
tags = ["tinytetris", "c++", "源码阅读"]
+++

最近发现一个用 C++ 开发的俄罗斯方块游戏 [tinytetris](https://github.com/taylorconor/tinytetris)，最近的更新在 5 年前，是一个老项目了。

整个项目核心就只有一个 cpp 源文件，并且仅仅依赖 curses 库，十分简单。不过代码里运用到了很多技巧，阅读起来并没有那么直观（README 文档也提到了）。


