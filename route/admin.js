// 引用express框架
const express = require('express');
const bcrypt = require('bcrypt');
// 导入用户集合构造函数
const {User} = require('../model/user');
// 创建博客页面展示内容
const admin = express.Router();

// 然后就可以挂载二级路由了, 这儿的根目录是/admin/
admin.get('/login', (req, res) => {
    // res.send('欢迎来到博客首页')
    res.render('admin/login');
});

// 实现登录功能
admin.post('/login', async(req, res) => {
    // 接受请求参数
    const {email, password} = req.body;
    // 用户没有输入邮件地址
    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error', {msg: '邮箱地址或密码错误'});
    }
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型
    // 如果没有查询到用户, user变量为空.
    let user = await User.findOne({email});
    // 查询到了
    if (user) {
        // 将客户端传递过来的密码与用户信息中的密码进行比对
        let isValid = await bcrypt.compare(password, user.password);
        console.log(password);
        console.log(user.password);
        if (isValid){
            req.username = user.username;
            res.send('登录成功');
        } else {
            res.status(400).render('admin/error', {msg: '邮箱地址或密码错误'});
        }
    } else {
        // 没有查询到用户
        res.status(400).render('admin/error', {msg: '邮箱地址或密码错误'});
    }
});

// 创建用户列表路由
admin.get('/user', (req,res) => {
    res.render('admin/user', {
        msg: req.username
    });
});
// 将路由对象作为模板成员进行导出
module.exports = admin;
