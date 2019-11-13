## 基于webpack开发多平台web端项目

### 前言
> 最近接触到一个官网项目，要求适配pc/移动端，因为后台数据接口都是一套的，为方便前端开发，减轻工作量，因此基于webpack配置了一套multiple phatform开发环境

### 思路

1.拆分以下三个不同入口，独立打包：
* 主入口 => index.html
* pc浏览器入口 => p_index.html
* mobile浏览器入口 => m_index.html

2.逻辑实现
> 浏览器首先加载index.html，index.html可以理解为一个代理入口（中间商），在此判断当前浏览器设备属于pc端，还是mobile端，然后重定向对应入口html


3.webpack配置

> 为了统一管理入口文件，封装了工具类函数entris方法，利用node.js相关方法自动读取
入口文件，入口文件路径规则./src/platform/*/*.js

4.路由配置

>同一项目下，添加两个不同设备平台的路由表

### 代码实现

请查看具体目录


end..
