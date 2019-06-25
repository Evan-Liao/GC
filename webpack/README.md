### HappyPack优化

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


