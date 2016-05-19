layout: tools
title: vim技巧点滴记录
description: vim skill record
date: 2015-12-05 11:39:42
tags: [tools,vim]
keywords: linux,vim,skill
category: tools
---

### 非编辑状态
注释/反注释: \c&lt;space&gt; 
代码格式化: =  , 可以通过V进入选择模式后选择要格式化的代码再输入=
删除: dw(删除整个单词)
行之间跳转, f/F+字母, 如fa, 往前跳转到第一个a字母位置,Fa, 往后
查找当前光标位置的单词, # 全配置
切换窗口: ctrl+w+(hjkl), 在一个终端里打开多个窗口时切换窗口
搜索: 下一个(n), 上一个(N)
切换缓存文件, :bN,   :是进入命令模式, bN, N是第几个缓存文件

### 下面需要插件支持, 和.vimrc的修改
在当前目录查找当前光标的单词: F3
在当前打开的文件里查找当前光标的单词: F4
打开新窗口显示当前目录的文件: tn, 可通过这个打开文件
打开新窗口显示当前文件的函数, 全局变量等: tl, 可能通过这个窗口打开变量,函数定义的位置
在当前目录查找文件: ctrl+p, 第一次打开要加载数据, 会比较慢

### 下面需要tags支持/ 需要当前目录(输入vim时的目录)有生成tags, 可通过命令
`ctags -R --c++-kinds=+p --fields=+ialS --extra=+q` 生成 tags, 后面可接多个目录, 没参数默认是当前目录.比如:
`ctags -R --c++-kinds=+p --fields=+ialS --extra=+q custom/ config/ platform/ kernel/` 就是生成custom/ config/ platform/ kernel/目录的tags
也可以在vim里输入  ctrl+\ ,就会在当前目录生成tags
跳转到当前参量, 函数定义的位置, ctrl+]
跳转到前一个位置: ctrl+o, 跳转到刚才ctrl+o时的位置: ctrl+i, 前进后退
列出当前光标变量,函数定义, 声明的位置: ts
搜索变量/函数定义声明的位置. :ts &lt;name&gt;(需要':', 则命令模式), 如    :ts is_card_sdio&lt;回车&gt;    会打开新窗口显示


### 打开文件的插件 CtrlP
在命令模式下输入Ctrl+p, 就会弹出界面, 如果有新增文件要按F5更新.

### 编辑模式下:
自动补全, ctrl+n, 如: 输入msdc&lt;ctrl+n&gt;, 会显示msdc开头的单词(没有tags的话只显示当前缓存的文件, 有tags会把tags里的文件都显示), 通过ctrl+n/p上下切换. 

### 除了单词补全外, 还可以(通过ctrl+x可查看) :
1. 行补全, ctrl+x+l
2. 文件补全, ctrl+x+f, 有些有冲突可能要大写F.


附 vim github
内有.vimrc
`git clone https://github.com/XJianfei/vim.git`

一些脚本，内有ctags
`git clone https://github.com/XJianfei/bin_tools.git`
