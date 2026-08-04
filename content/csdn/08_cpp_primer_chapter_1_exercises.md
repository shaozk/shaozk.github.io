+++
title = "C++ Primer 练习题第1章 开始"
date = "2024-11-09"

[taxonomies]
tags = ["leetcode"]
+++


## 习题

### 练习 1.1

查阅你使用的编译器的文档，确定它所使用的文件命名约定。编译并运行第2页的 `main` 程序。

```shell
$ man g++
...
# 头文件
       file.hh
       file.H
       file.hp
       file.hxx
       file.hpp
       file.HPP
       file.h++
       file.tcc
           C++ header file to be turned into a precompiled header or Ada spec.


# 源文件
       file.cc
       file.cp
       file.cxx
       file.cpp
       file.CPP
       file.c++
       file.C
           C++ source code that must be preprocessed.  Note that in .cxx, the last two letters must both be literally x.  Likewise, .C refers to a
           literal capital C.

...
```

```c++
// demo1_1.cpp

int main()
{
    return 0;
}
```

```shell
$ g++ -o demo1_1.out demo1_1.cpp 
$ ./demo1_1.out 
$ echo $?
0
```

### 练习 1.2

改写程序，让它返回-1。返回值-1通常被当做程序错误的标识。重新编译并运行你的程序，观察你的系统如何处理 `main` 返回的错误标识符。

```c++
// demo1_2.cpp

int main()
{
    return -1;
}
```

```shell
$ g++ -o demo1_2.out demo1_2.cpp 
$ ./demo1_2.out 
$ echo $?
255
```

### 练习 1.3

编写程序，在标准输出上打印 Hello, World。

```c++
// demo1_3.cpp
#include <iostream>

int main()
{
    std::cout << "Hello, Wolrd" << std::endl;
    return 0;
}
```

```shell
$ g++ -o demo1_3.out demo1_3.cpp 
$ ./demo1_3.out 
Hello, Wolrd
```

### 练习 1.4

我们的程序使用加法运算符 `+` 来将两个数相加。编写程序使用乘法运算符来打印两个数的积。

```cPP
// demo1_4.cpp
#include <iostream>

int main()
{
    int v1 = 0, v2 = 0;
    std::cin >> v1 >> v2;
    std::cout << v1 << " * " << v2 << " = " << v1 * v2 << std::endl;
    return 0;
}
```

```shell
$ g++ -o demo1_4.out demo1_4.cpp 
$ ./demo1_4.out 
3 4
3 * 4 = 12
```

### 练习 1.5

我们将所有的输出操作放在一个很长的语句中。重写程序，将每个运算对象的打印操作放在一条独立的语句中。

```cpp
// demo1_5.cpp
#include <iostream>

int main()
{
    int v1 = 0, v2 = 0;
    std::cin >> v1;
    std::cin >> v2;
    std::cout << v1;
    std::cout << " * ";
    std::cout << v2;
    std::cout << " = ";
    std::cout << v1 * v2;
    std::cout << std::endl;
    return 0;
}
```

```shell
$ g++ -o demo1_5.out demo1_5.cpp 
$ ./demo1_5.out 
3 5
3 * 5 = 15
```

### 练习 1.6

解释下面程序片段是否合法。

```cpp
std::cout << "The sum of " << v1;
	<< " and " << v2;
	<< " is " << v1 + v2 << std::endl;
```

如果程序是合法的，它输出什么？如果程序不合法，原因何在？应该如何修正？

```cpp
// demo1_6.cpp
#include <iostream>

int main()
{
    int v1 = 0, v2 = 0;
    std::cin >> v1 >> v2;
    std::cout << "The sum of " << v1;
        << " and " << v2;
        << " is " << v1 + v2 << std::endl;
    return 0;
}
```

```shell
# 不合法，将会报语法错误。因为第一行由';'结束，说明是一条完整的语句，而第二行输出运算符'<<'左边必须是一个ostream流类型对象，所以会报语法错误。
# 错误信息：
$ g++ -o demo1_6.out demo1_6.cpp 
demo1_6.cpp: In function ‘int main()’:
demo1_6.cpp:9:9: error: expected primary-expression before ‘<<’ token
    9 |         << " and " << v2;
      |         ^~
demo1_6.cpp:10:9: error: expected primary-expression before ‘<<’ token
   10 |         << " is " << v1 + v2 << std::endl;
      |         ^~
      
# 将每行代码末尾分号';'移除即可修正，具体代码如下：
std::cout << "The sum of " << v1
	<< " and " << v2
	<< " is " << v1 + v2 << std::endl;
```

### 练习 1.7

编译一个包含不正确的嵌套注释的程序，观察编译器返回的错误信息。

```shell
$ g++ -o demo1_7.out demo1_7.cpp 
demo1_7.cpp: In function ‘int main()’:
demo1_7.cpp:5:11: error: expected primary-expression before ‘/’ token
    5 |     /* */*/
      |           ^
demo1_7.cpp:6:5: error: expected primary-expression before ‘return’
    6 |     return 0;
      |     ^~~~~~
```

### 练习 1.8

指出下列哪些输出语句是合法的（如果有的话）：

```cpp
std::cout << "/*";
std::cout << "*/";
std::cout << /* "*/" */;
std::cout << /* "*/" /* "/*" */;
```

预测编译这些语句会产生什么样的结果，实际编译这些语句来验证你的答案（编写一个小程序，每次将上述一条语句作为其主体），改正每个编译错误。

```shell
1 正确
2 正确
3 错误 双引号缺少结束符
4 正确
```

```shell
// demo1_8_1.cpp
#include <iostream>

int main()
{
    std::cout << "/*";
    return 0;
}
```

```shell
$ g++ -o demo1_8_1.out demo1_8_1.cpp 
$ ./demo1_8_1.out 
/*$ 
```

```cpp
// demo1_8_2.cpp
#include <iostream>

int main()
{
    std::cout << "*/";
    return 0;
}
```

```shell
/*g++ -o demo1_8_2.out demo1_8_2.cpput 
$ ./demo1_8_2.out 
*/$ 
```

```cpp
// demo1_8_3.cpp
#include <iostream>

int main()
{
    std::cout << /* "*/" */;
    return 0;
}
```

```shell
*/g++ -o demo1_8_3.out demo1_8_3.cpput 
demo1_8_3.cpp:6:24: warning: missing terminating " character
    6 |     std::cout << /* "*/" */;
      |                        ^
demo1_8_3.cpp:6:24: error: missing terminating " character
    6 |     std::cout << /* "*/" */;
      |                        ^~~~~
demo1_8_3.cpp: In function ‘int main()’:
demo1_8_3.cpp:7:5: error: expected primary-expression before ‘return’
    7 |     return 0;
      |     ^~~~~~
```

```cpp
$ g++ -o demo1_8_4.out demo1_8_4.cpp 
$ ./demo1_8_4.out 
 /* $ 
```

```shell
$ g++ -o demo1_8_4.out demo1_8_4.cpp 
$ ./demo1_8_4.out 
 /* $ 
```

### 练习 1.9

编写程序，使用 `while` 循环将50到100的整数相加。

```cpp
// demo1_9.cpp
#include <iostream>

int main()
{
    int a = 50;
    int sum = 0;
    while ( a <= 100)
    {
        sum += a;
        a++;
    }
    std::cout << "sum = " << sum << std::endl; 
    return 0;
}
```

```shell
$ /g++ -o demo1_9.out demo1_9.cpp.out 
$ ./demo1_9.out 
sum = 3825
```

### 练习 1.10

除了 `++` 运算符将运算对象的值增加1之外，还有一个递减运算符（ `--` ）实现将值减少1。编写程序，使用递减运算符在循环中按递减顺序打印出10到0之间的整数。

```cpp
// demo1_10.cpp
#include <iostream>

int main()
{
    int a = 10;
    while ( a >= 0)
    {
        std::cout << a << " "; 
        a--;
    }
    std::cout << std::endl;
    return 0;
}
```

```shell
$ g++ -o demo1_10.out demo1_10.cpp 
$ ./demo1_10.out 
10 9 8 7 6 5 4 3 2 1 0 
```

### 练习 1.11

编写程序，提示用户输入两个整数，打印这两个整数所有指定的范围内的所有整数。

```cpp
// demo1_11.cpp
#include <iostream>

int main()
{
    int a = 0;
    int b = 0;
    int cur = 0;
    std::cout << "Input two number:\n";
    std::cin >> a >> b;
    if (a <= b)
    {
        cur = a; 
        while (cur <= b)
        {
            std::cout << cur << " "; 
            cur++;
        }
        std::cout << std::endl;
    }
    else
    {
        cur = a; 
        while (cur >= b)
        {
            std::cout << cur << " "; 
            cur--;
        }
        std::cout << std::endl;

    }
    return 0;
}
```

```shell
$ g++ -o demo1_11.out demo1_11.cpp 
$ ./demo1_11.out 
Input two number:
2 5
2 3 4 5 
$ ./demo1_11.out 
Input two number:
5 2
5 4 3 2 
```

### 练习 1.12

下面的 `for` 循环完成了什么功能？sum的终值是多少？

```cpp
int sum = 0;
for (int i = 0; i <= 100; ++i)
    sum += i;
```

```shell
# 计算从0到100之间整数的总和
# 5050
```

```cpp
// demo1_12.cpp
#include <iostream>

int main()
{
    int sum = 0;
    for (int i = 0; i <= 100; ++i)
        sum += i;
    std::cout << "sum = " << sum << std::endl;
    return 0;
}
```

```shell
$ g++ -o demo1_12.out demo1_12.cpp 
$ ./demo1_12.out 
sum = 5050
```

### 练习 1.13

使用 `for` 循环重做1.4.1节中的所有练习（第11页）。

```cpp
// demo1_13_1.cpp
#include <iostream>

int main()
{
    int sum = 0;
    for (int num = 50; num <= 100; ++num)
    {
        sum += num;
    }
    std::cout << "sum = " << sum << std::endl;
    return 0;
}


// demo1_13_2.cpp
#include <iostream>

int main()
{
    for (int n = 10; n > 0; --n)
    {
        std::cout << "n = " << n << std::endl;
    }
    return 0;
}


// demo1_13_3.cpp
#include <iostream>

using namespace std;

int main()
{
    int m, n;
    cout << "Please input 2 number:";
    cin >> m >> n;    
    if (m > n)
    {
        int tmp = m;
        m = n;
        n = tmp;
    }
    for (int i = m; i < n; ++i) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
```

```shell
# demo1_13_1.cpp
$ g++ demo1_13_1.cpp 
$ ./a.out 
sum = 3825

# demo1_13_2.cpp
$ g++ demo1_13_2.cpp 
$ ./a.out 
n = 10
n = 9
n = 8
n = 7
n = 6
n = 5
n = 4
n = 3
n = 2
n = 1

# demo1_13_3.cpp
$ g++ demo1_13_3.cpp 
$ ./a.out 
Please input 2 number:10 1
1 2 3 4 5 6 7 8 9 

```

### 练习 1.14

对比 `for` 循环和 `while` 循环，两种形式的优缺点各是什么？

```shell
# 对于for循环，有三个控制条件：初始值、结束值和步进值，其形式更为集中、简洁，且适用于循环次数已知的情况。

# 对于while循环，使用特定条件控制循环是否执行，适用于循环次数未知的情况。
```

### 练习 1.15

编写程序，包含第14页“再探编译”中讨论的常见错误。熟悉编译器生成的错误信息。

```cpp
// demo1_15.cpp
#include <iostream>

int main()
{
    // 错误：endl后使用了冒号而非分号
    std::cout << "Read each file." << std::endl:
    // 错误：字符串字面值常量的两侧漏掉了引号
    std::cout << Update master. << std::endl;
    // 错误：漏掉了第二个输出运算符
    std::cout << "Write new master." std::endl;
    // 错误：return语句漏掉了分号
    return 0
}
```

```shell
# 其中只有最后一个错误精准找到了 
$ g++ demo1_15.cpp 
demo1_15.cpp: In function ‘int main()’:
demo1_15.cpp:6:48: error: found ‘:’ in nested-name-specifier, expected ‘::’
    6 |     std::cout << "Read each file." << std::endl:
      |                                                ^
      |                                                ::
demo1_15.cpp:6:44: error: ‘std::endl’ is not a class, namespace, or enumeration
    6 |     std::cout << "Read each file." << std::endl:
      |                                            ^~~~
demo1_15.cpp:7:18: error: ‘Update’ was not declared in this scope
    7 |     std::cout << Update master. << std::endl;
      |                  ^~~~~~
demo1_15.cpp:8:37: error: expected ‘;’ before ‘std’
    8 |     std::cout << "Write new master." std::endl;
      |                                     ^~~~
      |                                     ;
demo1_15.cpp:9:13: error: expected ‘;’ before ‘}’ token
    9 |     return 0
      |             ^
      |             ;
   10 | }
      | ~        

```

### 练习 1.16

编写程序，从 `cin` 读取一组数，输出其和。

```cpp
// demo1_16.cpp
#include <iostream>

int main()
{
    int sum = 0, value = 0;
    while (std::cin >> value) 
    {
        sum += value;
    } 
    std::cout << "sum = " << sum << std::endl;
    return 0;
}
```

```shell
$ g++ demo1_16.cpp 
$ ./a.out 
3 4 5^E 
sum = 12
```

### 练习 1.17

如果输入的所有值是相等的，本节的程序会输出什么？如果没有重复值，输出又会是什么？

```shell
# 当输入的所有值是相等时，程序会计算该值出现的次数。
# 没有重复值时，每个值计数一次
```

### 练习 1.18

编译并运行本节的程序，给它输入全都相等的值。再次运行程序，输入没有重复的值。

```cpp
// demo1_17.cpp
#include <iostream>

int main()
{
    int currVal = 0, val = 0;
    if (std::cin >> currVal) 
    {
        int cnt = 1;
        while (std::cin >> val)
        {
            if (val == currVal)
            {
                ++cnt;
            }
            else 
            {
                std::cout << currVal << " occurs " 
                            << cnt << " times" << std::endl;
                currVal = val;
                cnt = 1;
            }
        }
        std::cout << currVal << " occurs "
                << cnt << " times" << std::endl;
    }
    return 0;
}
```

```shell
$ g++ demo1_18.cpp 
$ ./a.out 
1 1 1 1 1 1 1 1^E
1 occurs 8 times
$ ./a.out 
1 2 3 4 5 6 7 8 9^E
1 occurs 1 times
2 occurs 1 times
3 occurs 1 times
4 occurs 1 times
5 occurs 1 times
6 occurs 1 times
7 occurs 1 times
8 occurs 1 times
9 occurs 1 times
```

### 练习 1.19

修改你为1.4.1节练习1.10（第11页）所编写的程序（打印一个范围内的数），使其能处理用户输入的第一个数比第二个数小的情况。

```cpp
// demo1_19.cpp
#include <iostream>

using namespace std;

int main()
{
    int m, n;
    cout << "Please input 2 number:";
    cin >> m >> n;    
    if (m < n)
    {
        for (int i = m; i < n; ++i) 
        {
            cout << i << " ";
        }
        cout << endl;
    }
    else
    {
        for (int i = m; i > n; --i) 
        {
            cout << i << " ";
        }
        cout << endl;
    }
    return 0;
}
```

```shell
$ g++ demo1_19.cpp 
$ ./a.out 
Please input 2 number:1 10
1 2 3 4 5 6 7 8 9 
$ ./a.out 
Please input 2 number:10 1
10 9 8 7 6 5 4 3 2 
```

### 练习 1.20

在网站http://www.informit.com/title/03217714113 上，第1章的代码目录包含了头文件 `Sales_item.h` 。将它拷贝到你自己的工作目录。用它编写一个程序，读取一组书籍销售记录，将每条记录打印到标准输出上。

```cpp
// demo1_20.cpp
#include <iostream>
#include "include/Sales_item.h"

using namespace std;

int main()
{
    Sales_item item;
    while (cin >> item) 
    {
        cout << item << endl;
    }
    return 0;
}
```

```shell
$ g++ demo1_20.cpp 
$ ./a.out 
0-201-78345-X 3 20.00 0-201-78346-X 4 40.00
0-201-78345-X 3 60 20
0-201-78346-X 4 160 40
```

### 练习 1.21

编写程序，读取两个ISBN相同的 `Sales_Item` 对象，输出它们的和。

```cpp
// demo1_21.cpp
#include <iostream>
#include "include/Sales_item.h"

using namespace std;

int main()
{
    Sales_item item1, item2;
    if (cin >> item1 >> item2) 
    {
        if (item1.isbn() == item2.isbn())
        {
            cout << item1 + item2;
        }
    }
    return 0;
}
```

```shell
$ g++ demo1_21.cpp 
$ ./a.out 
0-201-78345-X 3 20.00
0-201-78345-X 5 20.00
0-201-78345-X 8 160 20$ 
```

### 练习 1.22

编写程序，读取多个具有相同ISBN的销售记录，输出所有记录的和。

```cpp
// demo1_22.cpp
#include <iostream>
#include "include/Sales_item.h"

using namespace std;

int main()
{
    Sales_item item;
    Sales_item sum;
    if (cin >> item)
    {
        sum = item;
        while (cin >> item) 
        {
            if (item.isbn() == sum.isbn())
            {
                sum += item;
            }
        }
    }
    cout << sum << endl;
    return 0;
}
```

```shell
$ ./a.out 
0-201-78345-X 3 20.00
0-201-78345-X 4 20.00
0-201-78345-X 5 20.00^E
^E
0-201-78345-X 12 240 20
```

### 练习 1.23

编写程序，读取多条销售记录，并统计一个ISBN（每本书）有几条销售记录。

```cpp
// demo1_23.cpp
#include <iostream>
#include "include/Sales_item.h"

using namespace std;

int main()
{
    Sales_item start;
    if (cin >> start)
    {
        int cnt = 1;
        Sales_item item;
        while (cin >> item) 
        {
            if (item.isbn() == start.isbn())
            {
                ++cnt;
            }
            else
            {
                cout << start.isbn() << " " << cnt << endl;
                cnt = 1;
                start = item;
            }
        }
        cout << start.isbn() << " " << cnt << endl;
    }
    return 0;
}
```

```shell
$ g++ demo1_23.cpp 
$ ./a.out 
0-201-78345-X 4 20.00
0-201-78345-X 6 30.00
0-201-78346-X 7 30.00^E
0-201-78345-X 2
^E         
0-201-78346-X 1
```

### 练习 1.24

输入表示多个ISBN的多条销售记录来测试上一个程序，每个ISBN的记录应该聚在一起。

```shell
# 见习题1.23
```

### 练习 1.25

借助网站上的 `Sales_Item.h` 头文件，编译并运行本节给出的书店程序。

```cpp
// demo1_25.cpp
#include <iostream>
#include "include/Sales_item.h"

int main()
{
    Sales_item total;
    if (std::cin >> total)
    {
        Sales_item trans;
        while (std::cin >> trans)
        {
            if (total.isbn() == trans.isbn())
            {
                total += trans;
            }
            else
            {
                std::cout << total << std::endl;
                total = trans;
            }
        }
        std::cout << total << std::endl;
    }    
    else
    {
        std::cerr << "No data?" << std::endl;
        return -1;
    }
    return 0;
}
```

```shell
$ g++ demo1_25.cpp 
$ ./a.out 
0-201-78345-X 3 20.0
0-201-78345-X 2 25.0
0-201-78346-X 4 40.0
0-201-78345-X 5 110 22
0-201-78347-X 7 70.0
0-201-78346-X 4 160 40
^E
^E
0-201-78347-X 7 490 70
```

## 总结

第一章总体来说十分简单，主要介绍有：

- C++程序的编译与运行

- 输入与输出（ `std::cin` 和 `std::cout` ）

- 注释（ `//` 和 `/* */` ）

- 控制语句，包括 `while` 循环、 `for` 循环和 `if` 语句

- 类简单使用，包括对象声明、类的成员函数调用以及类的 `+ - * / =` 操作（前提是需要在类定义时重载这些运算符）

