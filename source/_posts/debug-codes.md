layout: debug
title: android, c/c++/java, 打印调用堆栈，当前行, 当前函数
date: 2016-10-20 10:52:42
description: print trace, current line and current method for c/c++/java
tags: [android,linux,debug,c,c++,java]
keywords: android,linux,debug,trace,log
category: debug
---
<!-- more -->
1. Java层打印调用栈方法
```
Log.w(TAG, "Called:"+this, new RuntimeException("here").fillInStackTrace());
```

2. C++层打印调用栈方法
添加 libutils库
```
#include <utils/CallStack.h>
android::CallStack stack("LOG_TAG");
```

3. Kernel层打印调用栈方法
```
dump_stack();
```

4. c/c++ 获取当前行号， 方法名
```
// __FILE__、__FUNC__、__LINE__

#define show_line() printf("%s [%d]\n", __FUNC__, __LINE__);
```

5. java 获取当前行号， 方法名
转自： http://www.cnblogs.com/likwo/archive/2012/06/16/2551672.html
```
public abstract class CommonFunction {

	/** 
	 * * 打印日志时获取当前的程序文件名、行号、方法名 输出格式为：[FileName | LineNumber | MethodName]
	 * *
	 * * @return
	 * */
	public static String getFileLineMethod() {
		StackTraceElement traceElement = ((new Exception()).getStackTrace())[1];
		StringBuffer toStringBuffer = new StringBuffer("[").append(
				traceElement.getFileName()).append(" | ").append(
				traceElement.getLineNumber()).append(" | ").append(
				traceElement.getMethodName()).append("]");
		return toStringBuffer.toString();
	}   

	//当前文件名
	public static String _FILE_() {
		StackTraceElement traceElement = ((new Exception()).getStackTrace())[1];
		return traceElement.getFileName();
	}   

	// 当前方法名
	public static String _FUNC_() {
		StackTraceElement traceElement = ((new Exception()).getStackTrace())[1];
		return traceElement.getMethodName();
	}   

	// 当前行号
	public static int _LINE_() {
		StackTraceElement traceElement = ((new Exception()).getStackTrace())[1];
		return traceElement.getLineNumber();
	}   

	// 当前时间
	public static String _TIME_() {
		Date now = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		return sdf.format(now);
	}   
}
```




