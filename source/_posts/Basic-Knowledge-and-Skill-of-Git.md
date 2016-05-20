title: Git基础和常用命令
date: 2016-05-20 16:10:06
keywords: git,code,linux,android
description: Basic Knowledge and Skill of Git
tags: [git,code]
---
这里只介绍常用的命令和总结， git工作原理之类的就不一一描述了， 要更详细，更深入的知识可以查看
[Git Community Book 中文版](http://gitbook.liuhui998.com/)

# Git基础
1. 仓库的建立
	1.1 本地仓库初始化: 
	```
	git init
	```
	1.2 添加远程仓库链接: remote
	     ```
	     git remot add origin remotre_url
	     ```
	 origin: 远程仓库名， 可以任意名字
     remote_url: 远程仓库链接
	 1.3 从远程服务器获取仓库
	 ```
	 git clone git_url  [dir]
	 ```
	 dir：可有可无， 有则clone到dir目录
2. 最常用的提交和更新代码
	2.1.  本地操作: add, rm, commit, status, diff, checkout, rebase, reset...
	add, rm只是对缓存区的操作，要commit才算完成一次版本操作
	status: 查看当前仓库的文件状态
	diff: 查看当前仓库修改文件的详细对比内容， 新增文件不会显示， add后会显示
	checkout: 除了切换分支外， 还可以把代码还原到当前版本的状态，则还原当前未提交的文件
	2.2.  运程仓库: push, pull (--rebase), fetch
	commit后只是本地仓库的操作，服务器端还没有任何变化，需要把当前仓库的版本提交到服务器，则push命令， 这就是和svn的最大不同处。
	pull, fetch都是从服务器获取最新代码的命令， 不同是pull从服务器获取代码直接合并到本地， 而fetch则只是从服务器获取分支或者tag的代码，合并操作需要自己手动做。

3. 分支操作
3.1 分支的新建和切换: branch, checkout
3.2 分支的合并: merge/rebase
3.3 解决冲突， 出现冲突的文件会有以下的提示， 修正后提交则可解决
```
    <<<<<<< HEAD
     …..
     =======
     …..
     >>>>>>> other_branch
```
4.  仓库状态
4.1. status:  当前仓库的状态.
4.2. diff: 比较仓库中任意两个版本, 分支, 文件的差异
    --stat: 只显示哪些文件修改，以及修改的行数
     --check: 检查空格问题
     --color-words:  只用颜色区别修改. 
4.3. checkout: 还原文件
	只还原到当前版本可以
	```
	git checkout path/file
	```
	要还原到某一分支，tag或者版本可以
	```
    git checkout (branch/commit) -- (path/file)
    ```
4.4. tag: 标签
4.5. reset: --soft/--mixed/--hard
    --soft	恢复到某一commit. 所有修改过的文件都是暂存的.
	”changes to be  commit”, 只是仓库状态还原, 文件不还原
    --mixed(default)	恢复到某一commit.  
	所有修改过的文件都是未暂存状态.只是仓库状态还原, 文件不还原
    --hard	恢复到某一commit, 所有文件还原到该commit状态, 则文件还原
4.6. stash: 贮存当头修改的文件, 任务做了一半，突然要做其他任务，又不想commit, 就可以用这个命令把修改内容贮存起来，之后又回来做后面的一半. 
```
list, show, pop
```

4.7 cherry-pick, 单独合并某一分支的一个提交
```
git cherry-pick commit-hash
```

5.  仓库历史
5.1 log: 显示提交日志
     --oneline, ---stat
     --since/after, --before/until
     --author, --grep
     --diff-filter=D: 找出删除文件的commit
5.2. blame:  显示文件每一行最后修改的作者信息
     -L start,end
5.3. 找回丢失的对象. (commit)
	git fsck –lost-found
	git rebase

6. 其它
6.1 修改文件/目录名
git mv old_file new_file
6.2 查看仓库状态进阶
```
	1. git diff localbranch remotebranch filepath
	2. git log –diff-filter=D –summary
	3. git rev-list -n 1 HEAD -- <file_path>
	4. 		 git rev-list –all | (
		     while read revision; do
		         git grep -F ’Your search string’ $revision
		     done
		 )
```
6.3 修改特定的commit
这种情况下，你可以使用git rebase，例如，你想要修改bbc643cd commit，运行下面的命令：
	1. $git rebase bbc643cd^ –interactive
	2. pick 7ab870c 123
pick fb7a43f c
pick f12dbff rm c
Rebase ebb061c..f12dbff onto ebb061c
Commands:
p, pick = use commit/ 不作修改
r, reword = use commit, but edit the commit message/ 只修改commit 信息
e, edit = use commit, but stop for amending/ 修改内容




