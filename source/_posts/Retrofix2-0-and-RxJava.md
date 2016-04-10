title: Retrofix2.0 and RxJava
date: 2016-04-10 21:07:15
tags: Android, Retrofit, Http, Network
category: Android
---
Retrofix支持Call Adapter, 我们就是用这个来实现RxJava, 用Observable来替换Call。
Retrofix team实现了RxJava的CallAdpater, 接下来就简单介绍RxJavaCallAdpater
依赖包:
```
compile 'com.squareup.retrofit:adapter-rxjava:2.0.0-beta2'
compile 'io.reactivex:rxandroid:1.0.1'
```
通过addCallAdapterFactory来添加RxJava的CallAdapter
```
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl(BASE_URL)
    .addConverterFactory(GsonConverterFactory.create())
    .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
    .build();
```

Retrofix 服务接口， 返回Observable&lt;T&gt;来替换Call&lt;T&gt;

```
public interface PmsService{
    @GET("product/{id}/?format=json")
    Observable<Response<ResponseBody>> getProductInfo(@Path("id") int id);
}
```
使用RxJava来处理网络事件, 需要注意的是网络请求不能在UI主线程，
所以可以调用subscribeOn(Schedulers.io()) 来把网络请求放到io线程
```
pms.getProductInfo(100)
    .subscribeOn(Schedulers.io())
    .observeOn(Schedulers.newThread())
    .subscribe(new Observer<Response<ResponseBody>>() {
        @Override
        public void onCompleted() {
        }

        @Override
        public void onError(Throwable e) {
        }

        @Override
        public void onNext(Response<ResponseBody> response) {
        }
    });
```
