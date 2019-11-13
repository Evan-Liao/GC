
### 代码逻辑

```
const forceCheckInvokerSubject: Subject<any> = new Subject<any>();

public invokePoll() {
    this.forceCheckInvokerSubject.next();
}

private poll() {
    this.pollSubscription = Observable.interval(1000 * 60)
        .merge(forceCheckInvokerSubject)
        .exhaustMap(() => Observable.fromPromise(this.checkState()))
        .subscribe((response) => {
            if (response == null) return;

            // to do something
        });
}


private async checkState(): Promise<any> {

}

```

### 代码分析

* 创建定时器`Observable.interval(1000 * 60)`，每隔一分钟请求一次服务器
* 创建`forceCheckInvokerSubject`，`merge`操作符关联定时器，调用`this.forceCheckInvokerSubject.next()`，触发轮询
* exhaustMap保证`checkState()`已完成异步请求，否则忽略最新的next


### 业务场景

* websoket消息推送失败，主动发送cmd触发消息推送
* ...
