### Webpack构建优化

主要从以下两方面进行：

### 1. 缩小文件的搜索范围


1.1 优化Loader配置

通过`test`, `include`, `exclude`三个配置项命中Loader要应用规则的文件



1.2 优化resolve.modules配置

配置webpack去哪些目录寻找第三方模块，resolve.module默认值为['node_modules']



1.3 优化resolve.alias配置

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

1.4 优化resolve.extensions配置

* 频率出现最高的文件，放在前面，避免寻找过程
* 确定文件类型，要写全，`require('./data.json')`, not `require('./data')`


```
module.exports = {
  resolve: {
    extensions: ['js']
  
  }
  
}

```

#### 2.基础模块使用dll

大量复用的动态链接库只需被编译一次


#### 3.引入HappyPack

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


