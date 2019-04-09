### 基于面向对象内存回收设计模式
> js创建变量分配内存，以便储存变量的值；虽然js具有自动垃圾收集机制(GC: Garbage Collecation),  但是面对公司的业务场景，仍有必要手动进行GC,在不需要的时候destroy对象（如切换账号），释放内存。

#### 定义gc基类
> 通过this._destroy.bind(this), 绑定当前上下文


```
    export class GCBaseService {
        protected gcService: GCService;
        
        public readonly destroy: Function;
        
        constructor() {
            this.gcService = new GCService();
            this.destroy = this._destroy.bind(this);
        }
        
        private _destroy() {
            if (this.gcService) {
                this.gcService.gc();
            }
            
            this.onDestroy();
        }
        
        protected onDestroy() {
            // please override me
        }
    }
```

#### gc回收类
> 通过new BehaviorSubject()创建this._gc$可观察对象，take(1)表示资源垃圾回收只会触发一次

 ```
    export default class GCService {
        private readonly _gc$: BehaviorSubject<boolean>;
        public readonly gc$: Observable<undefined>;

        constructor() {
            this._gc$ = new BehaviorSubject<boolean>(false);
            this.gc$ = this._gc$.asObservable().filter(destroyed => destroyed === true).take(1).map(() => undefined);
        }

        public get destroyed(): boolean {
            return this._gc$.getValue() === true;
        }

        public gc() {
            if (this.destroyed === true) return;

            this._gc$.next(true);
            this._gc$.complete();
        }
    }
```

### 根据业务场景创建单例，继承GCBaseService
> serviceSingleton.destroy() 释放资源

```
    export class YourService extends GCBaseService() {
        constructor() {
            super();
        }

        onDestroy() {
            // to do something you want
        }
    }

    let serviceSingleton: YourService = null;

    export function getYourService(): YourService {
        if (!serviceSingleton) {
            serviceSingleton = new YourService();
        }
    
        return serviceSingleton;
    }

    export function destroyYourService() {
        if (serviceSingleton) {
            serviceSingleton.destroy();
            serviceSingleton = null;
        }
    }
```