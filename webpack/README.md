## Webpack构建优化

### 1. 缩小文件的搜索范围


#### 1.1 优化Loader配置

通过`test`, `include`, `exclude`三个配置项命中Loader要应用规则的文件



#### 1.2 优化resolve.modules配置

配置webpack去哪些目录寻找第三方模块，resolve.module默认值为['node_modules']



#### 1.3 优化resolve.alias配置

```
module.exports = {
  resolve: {
    // 使用alias将导入react的语句换成直接使用单独，完整的react.min.js文件
    // 减少耗时的递归解析操作
    alias: {
      'react': path.reolve(__dirname, './node_modules/react/dist/react.min.js')
    }
  }

}

```

#### 1.4 优化resolve.extensions配置

* 频率出现最高的文件，放在前面，避免寻找过程
* 确定文件类型，要写全，`require('./data.json')`, not `require('./data')`


```
module.exports = {
  resolve: {
    extensions: ['js']
  
  }
  
}

```

***

### 2.引入HappyPack

将任务分解给多个子进程并发去进行，子进程处理完成后将结果发送给主进程

原理：
在webpack构建流程中，最耗时的流程可能就是Loader对文件的转换操作了，因为要转换的文件数据量大，而且这些操作只能一个一个地处理。
HappyPack的核心原理就是将这部分的任务分解到多个进程中去并行处理，减少总的构建时间。

`new HappyPack`可以传入`threadPool`属性，多个HappyPack实例使用同一个共享进程池中的子进程去处理任务，防止资源占用过多。

实现：

```
npm i -D happypack
```

```
const path = require('path');
const HappyPack = require('happypack');
const happyPool = HappyPack.ThreadPool({size: 5})

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['happypack/loader?id=babel'],
        exclude: path/resolve(__dirname, 'node_modules')
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyPool
      // ... 其他配置
    })
  ]
}

```

***

### 3.Tree Shaking剔除无用代码

`Tree Shaking`仅支持Es6模块化语法

第三方模块配置

```
module.export = {
  resolve: {
    mainFields: ['jsnext: main', 'browser', 'main']
  }
}
```


指令: `webpack --display-used-exports --optimize-minimize`

***

### 4.静态资源CDN

通过publicPath参数设置存放静态资源的CDN目录URL

```
module.exports = {
  output: {
    ///
    
    publicPath: '//js.cdn.com/id/'
  },
  module: {
    rules: [
      {
        publicPath: '//js.cdn.com/id/'
      }
    ]
  }

}
```

***

### 5.提取公共代码

解决如下问题：
* 相同的资源被重复加载，浪费用户的流量和服务器的成本。
* 每个页面需要加载的资源太大，导致王爷首屏加载缓慢，影响用户体验


### 6. webpack 原理

webpack的构建流程可以分为一下三大阶段：

* 初始化： 启动构建，读取与合并配置参数，加载Plugin，实例化Compiler.
* 编译: 从Entry发出，递归地进行编译处理
* 输出：将编译后的Module组合成Chunk，Chunk转成文件，输出到文件系统中

打包后的`bundle.js`能直接运行在浏览器的原因是，在输出的文件中通过`_webpack_require_`函数，定义了一个可以在浏览器运行的加载函数，来模拟require语句。

原来一个个独立的模块文件并合并的原因是，浏览器不能像Node.js那样快速本地加载一个模块文件，而必须通过网络请求去加载未得到的文件，放到一个数组中加载，减少加载时间。

### 7.编写一个Plugin

```
class EndWebpackPlugin {
  constructor(doneCallback, failCallback) {
    this.doneCallback = doneCallback;
    this.failCallback = failCallback;
  }
  
  apply(compiler) {
    compiler.plugin('done', (stats) => {
      this.doneCallback(status)
    }),
    compiler.plugin('faild', (err) => {
      this.failCallback(err)
    })
  }

}

module.exports = EndWebpackPlugin

```

使用：

```
module.exports = {

  plugins: [
    new EndWebpackPlugin(() => {
      // when complier done , to do something
    }, (err) => {
        console.warn(err)
    }) 
  ]
}

```




