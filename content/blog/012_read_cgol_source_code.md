+++
title = "阅读 cgol 源码"
date = "2026-07-22"

[taxonomies]
tags = ["cgol", "c++", "源码阅读"]
+++


[cgol](https://github.com/p-ranav/cgol) 是一个使用 C++ 实现的 Conway 生命游戏，在终端通过读取 rle 文件启动。所有文件加在一起都只有 1000 行左右，非常适合入门学习。

```
cgol# cloc .
      36 text files.
      16 unique files.
      40 files ignored.

github.com/AlDanial/cloc v 2.08  T=0.01 s (1546.5 files/s, 124976.6 lines/s)
--------------------------------------------------------------------------------
Language                      files          blank        comment           code
--------------------------------------------------------------------------------
C/C++ Header                      7            116             77            605
C++                               3             26             22            212
YAML                              1              1              1            115
Markdown                          3             28              0             60
CMake                             1              4              0             24
Bourne Again Shell                1              0              0              2
--------------------------------------------------------------------------------
SUM:                             16            175            100           1018
--------------------------------------------------------------------------------
```

# 工程

介绍 C++ 项目工程的内容，与代码实现无关。

## 目录结构

非常典型的 C++ 项目，include 存放头文件，src 存放源文件。samples 目录存放的是 rle 文件。

```
cgol
├── CMakeLists.txt
├── clang-format.bash  // 批量格式化脚本
├── include
│   └── cgol
│       ├── cursor_control.hpp     // 光标控制
│       ├── cursor_movement.hpp    // 光标移动
│       ├── grid.hpp               // cell 网格
│       ├── rle_parser.hpp         // rle 文件解析器
│       ├── termcolor.hpp          // 获取终端颜色
│       ├── terminal_size.hpp      // 获取终端大小
│       └── utils.hpp              // 工具类
├── samples             // 存放 rle 文件目录
└── src
    ├── grid.cpp        // cell 网格
    ├── main.cpp        // 主程序入口
    └── rle_parser.cpp  // rle 文件解析器
```

源项目中还有 LICENSE、.gitignore 和一些 md 文件，因为重点是关注源代码，这些就不过多介绍了。

## CMake 构建

使用 CMake 构建，必然需要一个根配置文件 CMakeLists.txt。项目很简单，没有其他子配置文件。

```cmake
cmake_minimum_required(VERSION 3.8)  # CMake 最小版本 3.8
project(cgol)                        # 项目名 cgol

# 根据不同 CMake 版本设置 cgol 描述信息（版本越高内容越详细）
if(CMAKE_VERSION VERSION_GREATER_EQUAL "3.12")
  project(cgol VERSION 1.0.0 LANGUAGES CXX
    HOMEPAGE_URL "https://github.com/p-ranav/cgol"
    DESCRIPTION "Conway's Game of Life")
elseif(CMAKE_VERSION VERSION_GREATER_EQUAL "3.9")
  project(cgol VERSION 1.0.0 LANGUAGES CXX
    DESCRIPTION "Conway's Game of Life")
else()
  project(cgol VERSION 1.0.0 LANGUAGES CXX)
endif()

# 未指定发布模式时，默认使用 release 模式
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

set(CMAKE_CXX_FLAGS "-Wall -Wextra")  # 启动常见警告和额外警告
set(CMAKE_CXX_FLAGS_DEBUG "-g")       # debug 模式时使用该选项
set(CMAKE_CXX_FLAGS_RELEASE "-O3")    # release 模式使用最高级优化
set(CMAKE_CXX_STANDARD 11)            # 使用 c++11 标准

include_directories(include)
add_executable(cgol 
               src/grid.cpp
               src/rle_parser.cpp
               src/main.cpp)
```

## 格式化

clang-format.bash 和 .clang-format 文件，这两个用来批量格式化项目代码。

```bash
# clang-format.bash
find ./include ./src -type f \( -iname \*.cpp -o -iname \*.hpp \) | xargs clang-format -style="{ColumnLimit : 100}" -i
```

其作用是：找到 include 和 src 目录下所有后缀名为 .cpp 或 .hpp 的文件，按照 .clang-format 文件进行代码格式化，并动态修改每行字符限制为 100 个。一行命令里，用到了 find、xargs 和 clang-format 三个工具。


# 源码

本章将逐一介绍每一行代码，从 main 函数开始一点一点抽丝剥茧直到看到整个 cgol 全貌。

## 跨平台

cgol 支持类 Unix（Linux/MacOS） 和 Windows 两个平台，通过判断 _MSC_VER 宏是否定义来编写快平台代码。这类代码在项目中随处可以看到，本文主要讲解类 Unix 的代码。

```cpp

#if defined(_MSC_VER)
// Windows
#else
// Linux/MacOS
#endif
```

## 工具类


### cursor_control

功能：显示和隐藏光标。

实现：定义 cgol::cursor_hider 类利用 RAII 方法控制光标的显示与隐藏：初始化时隐藏，析构时重新显示。具体实现了静态内联函数 show_console_cursor()，其输入参数为 bool 值，代表是否显示光标。

这里需要补充一个知识点：Unix 可以通过往终端发送特定的 ANSI 转义序列来显示与隐藏光标，对应规则为：

* `"\033[?25h"` - 显示
* `"\033[?25l"` - 隐藏

```cpp
static inline void show_console_cursor(bool const show) {
  std::fputs(show ? "\033[?25h" : "\033[?25l", stdout);
}

struct cursor_hider {
    cursor_hider()  { show_console_cursor(false); }
    ~cursor_hider() { show_console_cursor(true); }
};
```

### cursor_movement

功能：上下左右任意移动光标。

实现：move_up()、move_down()、move_right() 和 move_left() 一组函数。对应 ANSI 转义序列为：

* "\033[nA" - 向上 n 行
* "\033[nB" - 向下 n 行
* "\033[nC" - 向右 n 行
* "\033[nD" - 向左 n 行

```cpp
static inline void move_up(int lines) { std::cout << "\033[" << lines << "A"; }
static inline void move_down(int lines) { std::cout << "\033[" << lines << "B"; }
static inline void move_right(int cols) { std::cout << "\033[" << cols << "C"; }
static inline void move_left(int cols) { std::cout << "\033[" << cols << "D"; }
```

### terminal_size

功能：获取终端的长宽。

实现：利用 ioctl() 函数 和 TIOCGWINSZ 来获取终端大小。 

```cpp
static inline std::pair<size_t, size_t> terminal_size() {
  struct winsize size;
  ioctl(STDOUT_FILENO, TIOCGWINSZ, &size);
  return {static_cast<size_t>(size.ws_row), static_cast<size_t>(size.ws_col)};
}

static inline size_t terminal_width() { return terminal_size().second; }
```
### termcolor

功能：控制终端打印不同颜色信息。这是一个仅头文件的三方 C++ 库 [termcolor.h](https://github.com/ikalnytskyi/termcolor)。

### util

功能：一组工具类，包括读取文件、字符串处理。

* read_file()：读取文件。输入为 rle 文件地址。输出为文件内容。
```cpp
static inline std::string read_file(const std::string &filename) {
  std::ifstream stream(filename);
  if (stream.fail()) {
    throw std::runtime_error("Error: Could not open file " + filename);
  }
  return std::string((std::istreambuf_iterator<char>(stream)), std::istreambuf_iterator<char>());
}
```

* split_string()：分隔字符串。输入为字符串和分隔符。输出为分隔开的字符串数组。
```cpp
static inline std::vector<std::string> split_string(const std::string &str,
                                                    const std::string &delimiter) {
  std::vector<std::string> strings;

  std::string::size_type pos = 0;
  std::string::size_type prev = 0;
  while ((pos = str.find(delimiter, prev)) != std::string::npos) {
    strings.push_back(str.substr(prev, pos - prev));
    prev = pos + delimiter.size();
  }

  // To get the last substring (or only, if delimiter is not found)
  strings.push_back(str.substr(prev));

  return strings;
}
```

* starts_with()：判断字符串前缀。
```cpp
static inline bool starts_with(const std::string &string, const std::string &substring) {
  return string.rfind(substring, 0) == 0;
}
```

* ltrim()：裁剪字符串左侧的空格。
```cpp
static inline void ltrim(std::string &s) {
  s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](int ch) { return !std::isspace(ch); }));
}
```

* rtrim()：裁剪字符串右侧的空格。
```cpp
static inline void rtrim(std::string &s) {
  s.erase(std::find_if(s.rbegin(), s.rend(), [](int ch) { return !std::isspace(ch); }).base(),
          s.end());
}
```

* trim()：裁剪字符串左右的空格。
```cpp
static inline void trim(std::string &s) {
  ltrim(s);
  rtrim(s);
}
```

* ltrim_copy()：裁剪字符串左侧的空格后进行拷贝（不修改源字符串）。
```cpp
static inline std::string ltrim_copy(std::string s) {
  ltrim(s);
  return s;
}
```

* rtrim_copy()：裁剪字符串右侧的空格后进行拷贝（不修改源字符串）。
```cpp
static inline std::string rtrim_copy(std::string s) {
  rtrim(s);
  return s;
}
```

* trim_copy()：裁剪字符串左右两侧的空格后进行拷贝（不修改源字符串）。
```cpp
static inline std::string trim_copy(std::string s) {
  trim(s);
  return s;
}
```

* strip_left()：删除字符串左侧匹配子串的部份。
```cpp
static inline std::string strip_left(const std::string &input_string, const std::string &chars) {
  std::string result = input_string;
  result.erase(result.begin(), std::find_if(result.begin(), result.end(), [&chars](int ch) {
                 return !std::isspace(ch) and (chars.find(ch) == std::string::npos);
               }));
  return result;
}
```

* strip_right()：删除字符串右侧匹配子串的部份。
```cpp
static inline std::string strip_right(const std::string &input_string, const std::string &chars) {
  std::string result = input_string;
  result.erase(std::find_if(result.rbegin(), result.rend(),
                            [&chars](int ch) {
                              return !std::isspace(ch) and (chars.find(ch) == std::string::npos);
                            })
                   .base(),
               result.end());
  return result;
}
```
* parse_digit_from_char()：字符转整形（OS：为啥不直接使用 c - '0' 转换？）。
```cpp
static inline size_t parse_digit_from_char(char c) {
  size_t result;
  std::stringstream str;
  str << c;
  str >> result;
  return result;
}
```


## 核心类

核心类只有 rle_parser 和 grid 两个，一个用于解析 rle 文件，另一个表征游戏棋盘。通过 rle_parser 类将 rle 文件解析到 grid 中，通过打印并不断刷新 grid 内容来模拟生命游戏过程。

### rle_parser

功能：解析 rle 文件并转储为方便使用的结构。

```cpp
class rle_parser {
  std::string rle_string_;            // 原始 RLE 文件内容
  std::string name_;                  // pattern 名
  std::vector<std::string> comments_; // 文件中所有的注释
  std::string author_;                // pattern 作者
  size_t size_x_{0};                  // pattern 行
  size_t size_y_{0};                  // pattern 列
  std::vector<size_t> rule_birth_;    // e.g., 3 in "B3"
  std::vector<size_t> rule_survival_; // e.g., 23 in "S23"
  std::string pattern_raw_;           // pattern 原始内容, e.g., "25boo85boo$24bo..."
  std::vector<std::vector<unsigned char>> pattern_2d_array; // 2D 数组表示 pattern_raw_

  // 解析名字、作者、注释、pattern 等内容
  void parse_attributes();

  // 解析 Conway 生命游戏的 RLE pattern（如 "25boo85boo$24bo..."）2D 字符数组
  void parse_pattern();

  // 打印解析后的 pattern — 仅用于调试
  void print() const;

public:
  // 打开 RLE 文件并解析它的 pattern
  // `grid_size_override` 参数用于覆盖 grid 的大小
  void open(const std::string &rle_string, std::pair<size_t, size_t> grid_size_override = {0, 0});

  // 返回 pattern 中的行数
  // 该值为以下两种情况之一：
  // 1. 从文件中解析出的值
  // 2. 或用户提供的作为覆盖的值
  size_t rows() const;

  // 返回 pattern 中的列数，类似 rows()
  size_t cols() const;

  // 返回一个解析 pattern 后的 2D 数组
  // e.g.,
  // [
  //   [baaaab],
  //   [ababab],
  //   [bbbbbb]
  // ]
  std::vector<std::vector<unsigned char>> pattern() const;
};

```

### grid

功能：游戏棋盘，即代表整个游戏。

```cpp
class grid {
  std::vector<std::vector<unsigned char>> grid_; // 2D 棋盘, 1 = 活着, 0 = 死亡
  size_t rows_;                                  // 棋盘行数
  size_t cols_;                                  // 棋盘列数
  rle_parser parser_;                            // RLE 解析器

public:
  // 使用 rle 文件构造生命游戏棋盘类
  // 棋盘大小 grid_size 用于建立游戏区域的纬度
  explicit grid(const std::string &rle_filename, const std::pair<size_t, size_t> &grid_size);

  // 返回行数，用于 main.cpp 向上移动光标 
  size_t rows() const;

  // 显示生命游戏棋盘
  void print(std::ostream &stream = std::cout) const;

  // 更新生命游戏棋盘
  void tick();
};

```

## main() 函数

主函数可以大致分成七步：
1. 定义静态变量 run 标志位，默认为 true，代表正在运行。
2. 使用 std::signal() 函数重写 SIGINT 对应的中断函数，函数只干了一件事，将 run 的标志修改为 false，代表结束运行。
3. 使用 cgol::cursor_hider 类隐藏光标。
4. 判断参数数量 argc 是否合法，不合法则打印帮助信息，然后退出。
5. 使用 cgol::terminal_size() 函数获取终端的长宽，用于设置游戏的棋盘大小。
6. 初始化 cgol::grid 棋盘类。
7. 启动由 run 标志确定的循环，不断进行棋盘显示、睡眠、棋盘更新。

```cpp
int main(int argc, char *argv[]) {
  static bool run = true;
  std::signal(SIGINT, [](int){ run = false; });

  // Hide console cursor
  cgol::cursor_hider ch;

  if (argc < 2) {
    std::cout << "Usage: ./main <pattern>.rle\n";
    return EXIT_FAILURE;
  }

  // Get terminal size and use as bounding box for game of life grid
  const auto terminal_size = cgol::terminal_size();
  size_t rows = terminal_size.first - 2, cols = (terminal_size.second) / 2;

  // Initialize grid with dimensions {rows, cols}
  cgol::grid grid(argv[1], {rows, cols});

  while (run) {
    grid.print();
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    move_up(grid.rows());
    grid.tick();
  }

  return EXIT_SUCCESS;
}
```

以上是全部内容。
