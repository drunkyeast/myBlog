// 引用express框架
const express = require('express');
// 创建博客页面展示内容
const home = express.Router();

// 然后就可以挂载二级路由了.
home.get('/', (req, res) => {
    res.send('欢迎来到博客首页')
});

module.exports = home;
