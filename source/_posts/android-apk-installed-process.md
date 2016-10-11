title: android apk installed process
date: 2016-10-11 15:30:56
description: android application(apk) installed process
tags: [Android, Appliction, Install, System]
keywords: android,apk,install,application
category: Android
---
<!-- more -->
安装过程log
```
I/PackageManager(  409): init_copy idx=0: InstallParams{7d3b642 file=/sdcard/estrongs_4.0.5.3_516.apk cid=null}
I/PackageManager(  409): mcs_bound
I/PackageManager(  409): startCopy UserHandle{-1}: InstallParams{7d3b642 file=/sdcard/estrongs_4.0.5.3_516.apk cid=null}
D/PackageManager(  409): installPackageLI: path=/data/app/vmdl1556781079.tmp
D/PackageManager(  409): manifestDigest was not present, but parser got: ManifestDigest {mDigest=42,3d,36,5f,fe,5c,95,54,2b,c9,77,92,34,ec,84,d9,3d,4e,5a,48,c7,81,11,76,98,6e,45,6d,c7,72,19,9d,}
D/PackageManager(  409): Renaming /data/app/vmdl1556781079.tmp to /data/app/com.estrongs.android.pop-1
D/PackageManager(  409): installNewPackageLI: Package{154f4afd com.estrongs.android.pop}
I/PackageManager(  409): Linking native library dir for /data/app/com.estrongs.android.pop-1
I/PackageManager(  409): Running dexopt on: /data/app/com.estrongs.android.pop-1/base.apk pkg=com.estrongs.android.pop isa=arm vmSafeMode=false
D/PackageManager(  409): New package installed in /data/app/com.estrongs.android.pop-1
W/PackageManager(  409): Not granting permission android.permission.WRITE_MEDIA_STORAGE to package com.estrongs.android.pop (protectionLevel=18 flags=0x48be44)
W/PackageManager(  409): Unknown permission android.permission.ACCESS_SUPERUSER in package com.estrongs.android.pop
W/PackageManager(  409): Unknown permission .PERMISSION in package com.estrongs.android.pop
V/PackageManager(  409): + starting restore round-trip 1
V/PackageManager(  409): token 1 to BM for possible restore
V/PackageManager(  409): BM finishing package install for 1
I/PackageManager(  409): mcs_unbind
I/PackageManager(  409): calling disconnectService()
V/PackageManager(  409): Handling post-install for 1![Alt text](./1476169832584.png)
```

安装服务class
```
framework/base/services/core/java/com/android/server/pm/PackageManagerService.java
```

```
installPackage -> installPackageAsUser -> send INIT_COPY
doHandleMessage
	INIT_COPY: connectToService -> mContext.bindServiceAsUser(service, mDefContainerConn,
									Context.BIND_AUTO_CREATE, UserHandle.OWNER)
			--> DefaultContainerConnection.onServiceConnected -> sendMessage(MCS_BOUND)
	MCS_BOUND: HandlerParams.startCopy -> handleStartCopy {
									检查安装位置
									if we have any installed package verifiers
										sendOrderedBroadcastAsUser-> CHECK_PENDING_VERIFICATION
									else
										args.copyApk } 
							         -> InstallParams.handleReturnCode
	

	CHECK_PENDING_VERIFICATION: args.copyApk
			DefaultContainerService.copyPackage
	
	
args.copyApk
1:       PackageManager.INSTALL_INTERNAL
2:       PackageManager.INSTALL_EXTERNAL
	

InstallParams.handleReturnCode -> processPendingInstall

processPendingInstall -> 
installPackageLI -> installNewPackageLI -> scanPackageLI(pkg...) -> scanPackageDirtyLI
	 7012             if (pkg.mOriginalPackages != null) {
	7340                 int ret = createDataDirsLI(
	        // We would never need to extract libs for forward-locked and external packages,
	        // since the container service will do it for us. We shouldn't attempt to
	        // extract libs from system app when it was not updated.
	7363             derivePackageAbi(pkg, scanFile, cpuAbiOverride, true /* extract libs */);
	//Linking native library
	mProviders.addProvider(p);
	mServices.addService(s);
	mReceivers.addActivity(a, "receiver");
	mActivities.addActivity(a, "activity");
	mPermissionGroups.put(pg.info.name, pg);
	mInstrumentation.put(a.getComponentName(), a);
	

native/cmds/installd/installd.cpp 
native/cmds/installd/commands.cpp

scanDirLI -> scanPackageLI(file...)

PackageManagerService.java
 6038     private PackageParser.Package scanPackageLI(File scanFile, int parseFlags, int scanFlags,
 6039             long currentTime, UserHandle user) throws PackageManagerException {

 6835     private PackageParser.Package scanPackageLI(PackageParser.Package pkg, int parseFlags,
 6836             int scanFlags, long currentTime, UserHandle user) throws PackageManagerException {
 6837         boolean success = false;
 6838         try {
 6839             final PackageParser.Package res = scanPackageDirtyLI(pkg, parseFlags, scanFlags,
 6840                     currentTime, user);
 6841             success = true;
 6842             return res;
 6843         } finally {
 6844             if (!success && (scanFlags & SCAN_DELETE_DATA_ON_FAILURES) != 0) {
 6845                 removeDataDirsLI(pkg.volumeUuid, pkg.packageName);
 6846             }
 6847         }
 6848     }


解释 APK
PackageParser.java
1456     private Package parseBaseApk(Resources res, XmlResourceParser parser, int flags,
![Alt text](./1476170758734.png)

```