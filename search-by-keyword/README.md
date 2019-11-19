# 实现关键字模糊搜索匹配

本实现与微信桌面版联系人搜索相似，实现如下功能： 

* 支持关键字输入中文/拼音
* 支持匹配多属性，如姓名，手机，其他...
* 支持关键字高亮
* 支持根据搜索结果匹配度排序

搜索结果将通过RxJs，暴露一条数据流供UI层调用，如下：

```
createUserSearchingStream({
            keyword$: this.keyword$,
            userIdList$: pabService.sortedContactIdList$
        })
            .takeUntil(this.gcService.gc$)
            .subscribe((result: IPabSearchResultMap) => {
                // to do something
            });
```

本代码仅为项目中抽离出来记录，仅供参考，非完整功能。

## 相关lib


* [RxJs](https://cn.rx.js.org/)
* [fuse.js](https://fusejs.io/)
* [grapheme-splitter](https://github.com/orling/grapheme-splitter)
