title: Android Retrofit 2.0入门
description: Rookie of Android Retrofit 2.0， 入门，教程
date: 2016-04-09 20:37:29
tags: [Android, Retrofit, Http, Network]
category: Android
---
Retrofit是什么, 官方标题写着A type-safe HTTP client for Android and Java。
这里是一篇简单的Retrofit2.0入门教程，说明基本的使用方法.
功能比较全， 比较强大，支持同步/异步，默认使用GSON, 可以写出漂亮的RESTful API, 并支持RxJava。

使用Retrofit主要三步走
1. 定义一个服务器支持的API接口
2. 创建Retrofit类, 一个实现1步骤接口的类
3. 通过Retrofit调用接口的API访问服务器
-------------------------------------------------------------------------------------------------------------------
下面以一个访问服务器Product的例子说明GET, POST的基本用法
<span style="font-size: 1.3em;font-weight: bold;">1. 定义API接口</span>
通过注释@GET, @POST来定义 get, post api
<span style="color:#bbb529;">@GET, @POST</span> 后面跟的是 URL, 可以是相对URL， 也可以是绝对URL， base url是在创建Retrofit提供的，后面会说明。
接口方法必须返回Call&lt;T&gt;, T可以是ResponseBody, 也可以是GSON。
接下来介绍几个常用的参数注释
<span style="color:#bbb529;">@Path</span>,  url里的可变参数，
如 
```
@GET("product/{id}/")
Call<ResponseBody> getProduct(@Path("id") int id);
```
调用getProduct(id)时， 就等于访问 product/id/ (id是参数)

<span style="color:#bbb529;">@Query</span>,  url里的查询参数。 就是url 问号后面的参数
如
```
@GET("product/")
Call<ResponseBody> getProducts(@Query("offset") int id, @Query("limit") int limit);
```
getProducts(100, 10);  就等于访问 product/?offset=100&limit=10

<span style="color:#bbb529;">@Filed</span>， 这个就是声明POST的参数列表

<span style="color:#bbb529;">@Body</span>， 这个就是原生POST数据（raw post data），可以是GSON

<span style="color:#bbb529;">@Headers</span>, 访问时添加的header

如下面定义4个接口。
```
public interface PmsService{
    @GET("product/{id}/?format=json")
    Call<ResponseBody> getProduct(@Path("id") int id);
    @GET("product/")
    Call<ResponseBody> getProducts(@Query("offset") int id, @Query("limit") int limit);

    @FormUrlEncoded
    @POST("product/{id}/")
    Call<ResponseBody> updateXiliCount(@Path("id") int id, @Field("count_of_xili") int count);

    @Headers({
        "Content-type: application/json"
    })
    @POST("product/{id}/")
    Call<ResponseBody> updateXCount(@Path("id") int id, @Body Product info);
}
```


<span style="font-size: 1.3em;font-weight: bold;">2. 创建Retrofit类</span>
```
    private static final String BASE_URL = "http://192.168.1.180:8008/api/v1/";
    Retrofit retrofit = new Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build();

    PmsService pms = retrofit.create(PmsService.class);
```

baseUrl： BASE_URL就是前面说的GET/POST url合成规则用的。 base url + GET/POST url = full url。
addConverterFactory： 就是添加数据转换器， 完成http request/response到需要的java数据转换， 如gson
下面是官方提供的转换器，
Gson: com.squareup.retrofit:converter-gson
Jackson: com.squareup.retrofit:converter-jackson
Moshi: com.squareup.retrofit:converter-moshi
Protobuf: com.squareup.retrofit:converter-protobuf
Wire: com.squareup.retrofit:converter-wire
Simple XML: com.squareup.retrofit:converter-simplexml

最后通过把API接口类作为参数传到retrofit.create来得到实现API接口的类。
PmsService pms = retrofit.create(PmsService.class);


<span style="font-size: 1.3em;font-weight: bold;">3. 通过Retrofit调用接口的API访问服务器</span>
到这里就可以访问服务器的API了， Retrofit提供了同步, 异同调用的方法
3.1 同步调用
```
    Call<ResponseBody> call = pms.getProduct(100);
    try {
        Response<ResponseBody> body = call.execute();
        dbg(""+body.isSuccessful());
        dbg(""+body.code());
        dbg(""+body.message());
        if (body.body() != null)
            dbg(""+body.body().string());
    } catch (IOException e) {
        e.printStackTrace();
    }
```
3.2 异步调用
```
    Call<ResponseBody> call = pms.getProduct(100);
    call.enqueue(new Callback<ResponseBody>() {
        @Override
        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
            try {
                dbg(""+call.request().url()+":" + response.body().string());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onFailure(Call<ResponseBody> call, Throwable t) {
        }
    });
```

上面就是分别通过同步/异步访问服务器的方法(GET http://192.168.1.00:8008/api/v1/product/100/)， 通过response.body().string() 可以获取服务器返回的原始数据

POST操作也是一样
```
    final Call<ResponseBody> call3 = pms.updateXiliCount(11, 40);
    call3.enqueue(new Callback<ResponseBody>() {
        @Override
        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
            dbg("#"+call.request().url());
            dbg(""+response.isSuccessful());
            dbg(""+response.code());
            dbg(""+response.message());
            if (response.body() != null)
                try {
                    dbg(""+response.body().string());
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }

        @Override
        public void onFailure(Call<ResponseBody> call, Throwable t) {

        }
        });
```

POST http://192.168.1.100:8008/api/v1/product/11/   with POST['count_of_xili']=40

通过GSON POST json数据
定义GSON
```
    public class Product {
        final Integer count_of_xili;
        final String serial;
        public Product(Integer count, String s) {
            this.count_of_xili = count;
            this.serial = s;
        }

    }
    final Call<ResponseBody> call4 = pms.updateXCount(11, new Product(1, "2"));
    call4.enqueue(new Callback<ResponseBody>() {
        @Override
        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
            dbg("# body "+call.request().url());
            dbg(""+response.isSuccessful());
            dbg(""+response.code());
            dbg(""+response.message());
            if (response.body() != null)
                try {
                    dbg(""+response.body().string());
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }

        @Override
        public void onFailure(Call<ResponseBody> call, Throwable t) {

        }
    });
```

POST http://192.168.1.100:8008/api/v1/product/11/   with {"count_of_xili":1,"serial":"2"}

最后加上需要用到的库
compile 'com.squareup.retrofit2:retrofit:2.0.1'
compile 'com.google.code.gson:gson:2.6.2'
compile 'com.squareup.retrofit2:converter-gson:2.0.0'

好了， 现在明白Retrofit是什么， 该怎么用了。更高级，细节的用法可提供官方文档或者Google查找

参考文章：
http://square.github.io/retrofit/    官方文档

http://wuxiaolong.me/2016/01/15/retrofit/
http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0915/3460.html



-----------------------------------

