// 引用express框架
const express = require('express');
// 处理路径
const path = require('path');
// 创建网站服务器, 要监听一个端口才能提供服务
const app = express();

// 数据库连接
require('./model/connect');


// 告诉express框架模板位置
app.set('views', path.join(__dirname, 'views'));
// 告诉express框架的默认后缀是什么
app.set('view engine', 'art');
// 当渲染后缀为art时的模板时, 所使用的模板引擎是什么
app.engine('art', require('express-art-template'));

// 开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')));


// 引入路由模块
const home = require('./route/home.js');
const admin = require('./route/admin'); // .js可以省略.
// 为路由
app.use('/home', home);
app.use('/admin', admin);

// 监听端口, 不输入会自动加上80端口的监听
app.listen(80);
console.log('网站服务器启动成功, 先直接访问公网ip: 35.78.109.23')
