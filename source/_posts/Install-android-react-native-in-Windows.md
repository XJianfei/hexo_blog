title: 在Windows上安装Android react-native
description: Install android react-native in Windows
date: 2016-05-17 18:28:59
tags: [Android, JS, react-native]
category: Android
---


参考:
http://facebook.github.io/react-native/docs/getting-started.html

首先安装个包windows的包管理工具 chocolately, 为后面安装node.js和react-native准备
用管理员权限打开Power Shell
运行 下面命令安装 chocolatey
```
iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1')) 
```

如果出现错误
“无法加载文件ps1，因为在此系统中禁止执行脚本”
可以运行下面命令解决
```
set-executionpolicy remotesigned
```

接着安装python2(现在只支持2, 不支持3), nodejs, react-native
choco install python2
choco install nodejs.install
npm install -g react-native-cli
到这就安装完react-native-cli了

接着添加环境变量ANDROID_HOME， 设置为sdk的目录， 就是目录下有platforms，platform-tools之类文件夹的目录。

然后创建项目，并试跑
生成project
```
react-native init project
```

启动react-native服务， 默认端口8081， 在一个终端下运行
```
react-native start
```
连接手机调试， 安装apk
```
react-native run-android
```
到这， demo应用已经安装到手机上， 如果是模拟器就应该看到hello world了。
如果在真机上调试需要设置服务器（windows）的IP和port

手机端打开应用， 摇动设备， 会出现菜单
Dev Setttings  --> Debug server host for device
输入windows的ip和port, 如 192.168.1.100:8081
返回菜单， Reload JS， 就可以看到hello world了。修改index.android.js试试看。
