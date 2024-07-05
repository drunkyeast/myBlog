// 导入用户集合构造函数
const { User } = require('../../model/user');
const bcrypt = require('bcrypt');
module.exports = async (req, res) => {
    // 接受请求参数
    const { email, password } = req.body;
    // 用户没有输入邮件地址
    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error', { msg: '邮箱地址或密码错误' });
    }
    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型
    // 如果没有查询到用户, user变量为空.
    let user = await User.findOne({ email });
    // 查询到了
    if (user) {
        // 将客户端传递过来的密码与用户信息中的密码进行比对
        let isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            req.session.username = user.username; // 一切都很自动,自动存储到session. 
            req.app.locals.userInfo = user; // 这个很关键啊, req能调用app, locals表express框架的本地变量, userInfo可以在其他模板中直接{{userInfo}}获取.
            res.redirect('/admin/user');
        } else {
            res.status(400).render('admin/error', { msg: '邮箱地址或密码错误' });
        }
    } else {
        // 没有查询到用户
        res.status(400).render('admin/error', { msg: '邮箱地址或密码错误' });
    }
}