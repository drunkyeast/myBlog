const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // 用于处理post请求参数
const session = require('express-session');

const app = express(); // 创建网站服务器, 要监听一个端口才能提供服务
require('./model/connect'); // 数据库连接
app.use(bodyParser.urlencoded({extended: false})); // 用bodyParser处理poset请求参数

app.use(session({secret: 'secret key'}));

// 告诉express框架模板位置, 默认后缀, 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');
app.engine('art', require('express-art-template'));

// 开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')));

// 路由处理
const home = require('./route/home.js');
const admin = require('./route/admin'); // .js可以省略.

app.use('/admin', (req, res, next) => {
    // 判断用户是否访问登录页面. 判断用户是不是登录状态, 如果不是则重定向到登录页面.
    if (req.url != '/login' && !req.session.username) {
        res.redirect('/admin/login');
    } else {
        // 用户是登录状态, 将请求放行
        next();
    }

});

app.use('/home', home);
app.use('/admin', admin);

app.listen(80);
console.log('网站服务器启动成功, 先直接访问公网ip: 35.78.109.23')
