title: DBFlow入门使用教程
date: 2016-04-30 22:06:46
tags: Android SQL DBFlow
category: Android
---
下面是DBFlow官方的简介描述:
A robust, powerful, and very simple ORM android database library with annotation processing.
The library is built on speed, performance, and approachability. It not only eliminates most boiler-plate code for dealing with databases, but also provides a powerful and simple API to manage interactions.
Let DBFlow make SQL code flow like a steady stream so you can focus on writing amazing apps.


官方github:  https://github.com/Raizlabs/DBFlow
版本: 3.0


### 添加配置
在应用gradle里添加marven, 有加 Add, DBFlow的两行
```
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        // Add, DBFlow
        classpath 'com.neenbedankt.gradle.plugins:android-apt:1.8'
    }
}

allProjects {
    repositories {
        // Add, DBFlow
        maven { url "https://jitpack.io" }
    }
}
```

在module gradle里添加
```
apply plugin: 'com.neenbedankt.android-apt'

// dbflow版本
def dbflow_version = "3.0.0-beta6"
// or dbflow_version = "develop-SNAPSHOT" for grabbing latest dependency in your project on the develop branch
// or 10-digit short-hash of a specific commit. (Useful for bugs fixed in develop, but not in a release yet)

dependencies {
    apt "com.github.Raizlabs.DBFlow:dbflow-processor:${dbflow_version}"
        compile "com.github.Raizlabs.DBFlow:dbflow-core:${dbflow_version}"
        compile "com.github.Raizlabs.DBFlow:dbflow:${dbflow_version}"
        compile "com.github.Raizlabs.DBFlow:dbflow-sqlcipher:${dbflow_version}"
}
```

### 初始化 FlowManager
这里在Application里初始化
``` 
public class ExampleApplication extends Application {

    @Override
        public void onCreate() {
            super.onCreate();
            FlowManager.init(new FlowConfig.Builder(this).build());
        }
}
```
在AndroidManifest.xml里声明ExampleApplication
```
<application
android:name="{packageName}.ExampleApplication"
...>
</application>
```

### 创建数据库
AppDatabase.java
    ```
@Database(name = AppDatabase.NAME, version = AppDatabase.VERSION)
    public class AppDatabase {

        public static final String NAME = "AppDatabase";
        public static final int VERSION = 1;
    }
```

Dog.java
    ```
@Table(database = AppDatabase.class)
    public class Dog extends BaseModel {

        @PrimaryKey
            private String name;
        @Column (defaultValue = "w")
            private String content;


        public void setName(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getContent() { return content; }
    }
```

### 插入一个数据
#### 使用Dog.save()
```
Dog dog = new Dog();
dog.setContent("a noble dog");
dog.setName("wangcai");
dog.save();
```
####使用SQLite.insert()
    ```
    SQLite.insert(Dog.class)
.columns(Dog_Table.name, Dog_Table.content)
    .values("wangwagn", "a poor dog")
    .execute();

    // or 
SQLite.insert(Dog.class)
    .columnValues(Dog_Table.name.eq("Default"),
            Dog_Table.content.eq("5555555"))
    .async()
.execute()
    ```

###查询返回query
    ```
    SQLite.select().from(Dog.class)
.async()
    .queryResultCallback(new QueryTransaction.QueryResultCallback<Dog>() {
            @Override
            public void onQueryResult(QueryTransaction transaction,
                @NonNull CursorResult<Dog> tResult) {
            dbg("count: "+tResult.toList().size());
            for (Dog dog : tResult.toList()) {
            dbg("# " + dog.getName() + " -- " + dog.getContent());
            /* one update mode way
               dog.setContent(dog.getContent() + "!");
               dog.save();
             */
            }
            }
            }).execute();
```
### 封装好的sqlite 语句
如查询 name = 'wangcai' 的数量
```
SQLite.select().from(Dog.class).where(Dog_Table.name.eq("wangcai")).count();
```
更多的介绍请自己查看
[SQLite Wrapper Language](https://github.com/Raizlabs/DBFlow/blob/master/usage2/SQLiteWrapperLanguage.md)
如: where, join, orderBy, limit, offset

还有更多高级功能，待续...

