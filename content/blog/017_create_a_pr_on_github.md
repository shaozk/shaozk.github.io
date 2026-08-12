+++
title = "在 Github 上发起 PR 流程"
date = "2026-08-06"

[taxonomies]
tags = ["github", "git"]
+++


想要提 PR 却又忘记了流程，记录一下加深印象。正好有个例子，修改 [httplib](https://github.com/yhirose/cpp-httplib) 的一个 typo 错误（OS：我真是没事找事）。

1. 在 Github 上 fork 目标仓库
2. 克隆 fork 后仓库到本地
    ```bash
    git clone https://github.com/shaozk/cpp-httplib.git
    ```
3. 切换分支并提交修改内容
    ```bash
    git checkout -b fix_example_typos
    # 省略具体提交的内容
    ```
4. 上传远程仓库
    ```bash
    git push origin fix_example_typos
    ```
5. 在 Github 上发起 PR 申请
6. 设置 upstream 为原仓库地址
    ```bash
    git remote add upstream https://github.com/yhirose/cpp-httplib.git
    ```
7. 切换到主分支并拉去最新修改
    ```bash
    git checkout master
    git pull upstream master  
    ```

其中第 1 5 两步都是在 Gihtub 网页上操作，用鼠标点击即可完成，就省略操作步骤啦。

第 6 7 步是为了同步原仓库的最新提交。

