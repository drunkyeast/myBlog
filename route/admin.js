// 引用express框架
const express = require('express');
// 创建博客页面展示内容
const admin = express.Router();

// 然后就可以挂载二级路由了, 这儿的根目录是/admin/
admin.get('/login', require('./admin/loginPage'));

// 实现登录功能
admin.post('/login', require('./admin/login'));

// 创建用户列表路由
admin.get('/user', require('./admin/userPage'));

admin.get('/logout', require('./admin/logout'));

admin.get('/user-edit', require('./admin/user-edit'));

admin.post('/user-edit', require('./admin/user-edit-fn'));

// 将路由对象作为模板成员进行导出
module.exports = admin;
