+++
title = "使用 Bear 生成 compile_commands.json"
date = "2026-07-12"

[taxonomies]
tags = ["bear", "tool"]
+++

最近使用 Helix 写 C++ ，为了实现在代码间快速导航，需要在 CMake 构建时额外增加选项 `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON` 来自动生成 compile_commands.json 文件。

然而有些代码直接用 make 构建的，但 make 没有选项支持生成 compile_commands.json 文件（OS：我也不想给它们一一补上 CMakeLists.txt）。

这个时候，可以使用 bear 工具：

```bash
bear -- make
```

执行完命令就会生成 compile_commands.json 文件，我又可以愉快地使用 Helix 了。

等等如果连 make 都没有该怎么办呢？Bear 早就帮你想到了。

```bash
bear -- <your-build-command>
```

任何构建命令 bear 工具都支持，你可以直接把构建命令或构建脚本直接传给 bear 。


# 参考
* https://github.com/rizsotto/Bear
* https://zhuanlan.zhihu.com/p/2003798816588067858
* https://www.annya.work/bear/bear.html
