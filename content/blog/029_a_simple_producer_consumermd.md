+++
title = "最简单的生产者-消费者模式实现"
description = ""
date = "2026-10-17"

[taxonomies]
tags = ["c++", "thread", "设计模式"]
+++

## 生产者-消费者模式

这是多线程开发中一种常见的设计模式，用于解决数据生产和消费速度不一致的问题。

在生产者和消费者二者之间增加一层缓冲区，生产者只需要关心缓冲区是否还能存放数据，不需要等待消费者处理完；同样消费者只关注缓冲区是否还存有数据。

也就是说，这样的模型可以带来最显著的优势是：生产者和消费者完全解耦合，可以独立开发和扩展。如你可以增加并发数、支持分布式开发等。


## 如何实现？

分三部分考虑：

* 对于缓冲区：先生产的数据要被先消费，自然想到缓冲区用队列结构实现。缓冲区有大小限制，你不能在满了之后继续生产数据。当然也不能在空的时候消费数据。

* 对于生产者：在往缓冲区存放数据前，判断是否已满。当缓冲区已满时，使用条件变量等待数据被拿取，直到能够继续存放数据。存完数据后通知消费者。

* 对于消费者：在拿去缓冲区数据时，判断是否为空。当缓冲区为空时，使用条件变量等到新数据存放，直到能够拿取数据。拿完后通知生产者。

## 代码实现

假定缓冲区存放 int 型数据，缓冲区大小为 5 。

```cpp
#include <iostream>
#include <mutex>
#include <condition_variable>
#include <thread>

std::mutex mtx;
std::condition_variable cv;
std::queue<int> que;
const int MAX_SIZE = 5;

void producer() {
  for (int i = 0; i < 10; ++i) {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, [] { return que.size() < MAX_SIZE; });
    que.push(i);
    std::cout << "produce " << i << "/" << que.size() << std::endl;
    cv.notify_all();
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
  }
}

void consumer() {
  for (int i = 0; i < 10; ++i) {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, [] { return !que.empty(); });
    int val = que.front();
    que.pop();
    std::cout << "consume " << i << "/" << que.size() << std::endl;
    cv.notify_all();
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
  }
}

int main() {
  std::thread p(producer);
  std::thread c(consumer);
  p.join();
  c.join();
  return 0;
}

```

下次面试官让我使用 C++ 实现生产者-消费者模型，可以直接照着这个写，而不是陷入尴尬的境地 :<

## 参考

[生产者-消费者模型：理论讲解及实现（C++）](https://www.cnblogs.com/horacle/p/15425808.html)
