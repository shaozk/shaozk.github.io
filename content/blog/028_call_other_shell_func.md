+++
title = "调用其他 Shell 脚本的函数"
date = "2026-10-14"

[taxonomies]
tags = ["shell"]
+++

当 Shell 脚本比较大的时候，我们会希望独立一些常用的函数（类似面向对象编程的工具类）为一个脚本，供其他脚本使用，从而拥有更清晰的结构，也更便于后续维护。

在一般的编程语言中，我们可以通过引入的方法来实现这一行为。如 C/C++ 中 include 头文件的方法、Python 中使用的 import 语句。那 Shell 脚本中该如何实现呢？

## source 内置命令

source 是一个 Shell 的内置命令，作用为在当前环境下读取指定的脚本内容并运行其中的命令，用该命令可以实现这一点。

```bash
# func.sh
#!/bin/bash
func() {
  echo "hello";
}
```

```bash
# call_func.sh
#!/bin/bash
source func.sh
func
```


## 用 bash 行不行？

bash 也可以运行脚本命令，那能不能使用呢？答案是否定的，因为 bash 执行脚本会新建子 Shell，无法影响当前 Shell 的环境。如果将上文代码中 source 直接替换为 bash，执行将会报错：找不到 func 命令。

这里一定要注意 bash 和 source 的区别，source 在当前环境运行，bash 在子进程环境运行。如果我是面试官，这很好出题。


## 如何给子进程传递函数？

我们知道使用 bash 命令会在子进程运行，那么如果我们的需求是将当前进程的函数传递给子进程呢？

可以使用 export 内置命令，并使用 -f 选项指定需要传递的函数。

```bash
# export_func.sh
#!/bin/bash
source func.sh
export -f func
bash -c 'func'
```


## 总结

虽然现在使用 AI 可以快速写出你需要的脚本，但我想基础只是也是不能没有的，不要让 AI 蒙蔽了你的双眼。

"曾经，人类把思考交给机器，希望这样能让自己自由。但那只是让拥有机器的另一些人得以奴役他们。" - 《沙丘》
