
### 业务场景
> 用户处于离线状态，登陆客户端上线，触发websocket离线推送，因目前我司后台离线/在线推送接口cmd是一样的，
这个时候客户端可能短时间接收几十条，甚至几百条离线推送信息，其中，这些离线信息中可能包含重复消息，对于
前端来说，业务逻辑只需处理一次。

### 技术栈
* RxJs

### 代码实现


```
    this.webSokectPushSubject.next(meta)

    let webSocketMessageMeta$ = this.webSokectPushSubject
            .asObservable()
            .filter(meta => meta != null)
            .groupBy(meta => meta.id)
            .mergeMap(groupMeta$ =>
                groupMeta$.switchMap(meta => {
                    let { id, type } = meta;

                    return Observable.from(
                        new Promise(resolve => {
                            setTimeout(async () => {
                                // resolve(null) or resolve(meta)
                            }, 0);
                        })
                    );
                })
            )
            .share();

        this.$subscribeTo(webSocketMessageMeta$, async meta => {
            if (!meta) return;

             // to do something
        });

```

### 简单代码分析

1.websocket是单条推送的，接收一条消息，调用next
```
this.webSokectPushSubject.next(payload)

```

2.通过groupBy操作符分组合并消息类型，相同id的消息为一组

```
/*
  输出:
  [{id: 1, name: "Sue"},{id: 1, name: "Frank"}]
  [{id: 2, name: "Joe"}]
  [{id: 3, name: "Sarah"}]
*/
```

3.mergeMap目的是为每种类型的消息得到并行处理

4.switchMap有新消息进来，会取消本次结果，以最新的推送为准，目的为避免提高性能，保证每种类型消息只处理一次