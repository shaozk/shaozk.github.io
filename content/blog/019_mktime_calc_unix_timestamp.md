+++
title = "mktime.c 计算 UNIX 时间戳"
date = "2026-08-10"

[taxonomies]
tags = ["linux", "源码阅读"]
+++

最近尝试阅读 Linux-0.12 源码，让 AI 帮我挑选一个简单的给我，于是有了本文的内容。

在正式介绍之前，有个背景知识需要补充：Linux 使用 1970 年 1 月 1 日作为纪元时间，UNIX 时间戳指的是从这天开始到当前时间的间隔秒数。1970 年 1 月 1 日差不多就是 UNIX 诞生的时间。

`mktime.c` 中仅仅只有一个函数 `kernel_mktime()`，目的是将时间结构体 `struct tm` 转换为 UNIX 时间戳。

代码首先定义了年、日、时、分四个宏，用于将其直接转换称对应秒。

```c
#define MINUTE 60
#define HOUR (60*MINUTE)
#define DAY (24*HOUR)
#define YEAR (365*DAY)
```

这里没有关于月的宏，因为一个月的天数是不定的。这里使用一个长度为 12 的数组，一个元素代表抵达到这个月的时间，并假定为闰年（2 月有 29 天）。


```c
/* interestingly, we assume leap-years */
static int month[12] = {
	0,
	DAY*(31),
	DAY*(31+29),
	DAY*(31+29+31),
	DAY*(31+29+31+30),
	DAY*(31+29+31+30+31),
	DAY*(31+29+31+30+31+30),
	DAY*(31+29+31+30+31+30+31),
	DAY*(31+29+31+30+31+30+31+31),
	DAY*(31+29+31+30+31+30+31+31+30),
	DAY*(31+29+31+30+31+30+31+31+30+31),
	DAY*(31+29+31+30+31+30+31+31+30+31+30)
};
```

具体转换方法：

1. 年转换为秒

	除了年份减去 70 之外，还需要判断当年距 1970 年之间出现了几次闰年，并补上额外的天数。

 	这里有一个很巧妙的方法：(year+1)/4：从 1970 年开始，到 1972 为第一个闰年，但是此时是无需额外补充闰日的，要到 1973 年也就是 (3+1)/4 = 1 才补充一天闰日。

	注：这里并没有考虑 2000 年及以后的情况。

2. 月转换为秒

	查预先设置好的月份表，因为提前假定是闰年，所以当是平年且月份大于1时，需要额外减去一天时间。

3. 日转换为秒

	因为 tm_mday 取值范围时 1-31，因此在转换时需要减去 1 天（当天还没过去）。

	```c
	struct tm {
		int	tm_sec;		/* seconds after the minute [0-60] */
		int	tm_min;		/* minutes after the hour [0-59] */
		int	tm_hour;	/* hours since midnight [0-23] */
		int	tm_mday;	/* day of the month [1-31] */
		int	tm_mon;		/* months since January [0-11] */
		int	tm_year;	/* years since 1900 */
		int	tm_wday;	/* days since Sunday [0-6] */
		int	tm_yday;	/* days since January 1 [0-365] */
		int	tm_isdst;	/* Daylight Savings Time flag */
		long	tm_gmtoff;	/* offset from UTC in seconds */
		char	*tm_zone;	/* timezone abbreviation */
	};

	```
	
4. 时、分、秒转换为秒

	直接按照对应宏进行转换。


源码很短，将其全部贴在这里：

```c
/*
 *  linux/kernel/mktime.c
 *
 *  (C) 1991  Linus Torvalds
 */

#include <time.h>

/*
 * This isn't the library routine, it is only used in the kernel.
 * as such, we don't care about years<1970 etc, but assume everything
 * is ok. Similarly, TZ etc is happily ignored. We just do everything
 * as easily as possible. Let's find something public for the library
 * routines (although I think minix times is public).
 */
/*
 * PS. I hate whoever though up the year 1970 - couldn't they have gotten
 * a leap-year instead? I also hate Gregorius, pope or no. I'm grumpy.
 */
#define MINUTE 60
#define HOUR (60*MINUTE)
#define DAY (24*HOUR)
#define YEAR (365*DAY)

/* interestingly, we assume leap-years */
static int month[12] = {
	0,
	DAY*(31),
	DAY*(31+29),
	DAY*(31+29+31),
	DAY*(31+29+31+30),
	DAY*(31+29+31+30+31),
	DAY*(31+29+31+30+31+30),
	DAY*(31+29+31+30+31+30+31),
	DAY*(31+29+31+30+31+30+31+31),
	DAY*(31+29+31+30+31+30+31+31+30),
	DAY*(31+29+31+30+31+30+31+31+30+31),
	DAY*(31+29+31+30+31+30+31+31+30+31+30)
};

long kernel_mktime(struct tm * tm)
{
	long res;
	int year;

	year = tm->tm_year - 70;
/* magic offsets (y+1) needed to get leapyears right.*/
	res = YEAR*year + DAY*((year+1)/4);
	res += month[tm->tm_mon];
/* and (y+2) here. If it wasn't a leap-year, we have to adjust */
	if (tm->tm_mon>1 && ((year+2)%4))
		res -= DAY;
	res += DAY*(tm->tm_mday-1);
	res += HOUR*tm->tm_hour;
	res += MINUTE*tm->tm_min;
	res += tm->tm_sec;
	return res;
}

```

一个比较有趣的彩蛋是：Linus 在注释中说自己讨厌 1970 并吐槽为什么不直接用闰年作为起始年。

