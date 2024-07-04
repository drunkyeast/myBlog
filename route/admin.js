// 引用express框架
const express = require('express');
// 创建博客页面展示内容
const admin = express.Router();

// 然后就可以挂载二级路由了, 这儿的根目录是/admin/
admin.get('/login', (req, res) => {
    // res.send('欢迎来到博客首页')
    res.render('admin/login');
});

// 创建用户列表路由
admin.get('/user', (req,res) => {
    res.render('admin/user');
});
// 将路由对象作为模板成员进行导出
module.exports = admin;
