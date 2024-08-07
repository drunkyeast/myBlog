// 创建用户集合
// 引入mongoose第三方模块
const mongoose = require('mongoose');
// 导入bcrypt
const bcrypt = require('bcrypt');
// 引入joi模块
const Joi = require('joi');

// 创建用户集合规则
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        // 保证邮箱地址在插入数据库时不重复
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // admin 超级管理员
    // normal 普通用户
    role: {
        type: String,
        required: true
    },
    // 0 启用状态
    // 1 禁用状态
    state: {
        type: Number,
        default: 0
    }
});

// 创建集合
const User = mongoose.model('User', userSchema);

async function createUser() {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('123456', salt);
    const user = await User.create({
        username: 'setsuna',
        email: 'setsuna@qq.cn',
        password: pass,
        role: 'admin',
        state: 0
    });
}

// createUser();

// 验证用户信息
const validateUser = user => {
    // 定义对象的验证规则
    const schema = Joi.object({
        username: Joi.string().min(2).max(12).required().messages({
            'string.base': '用户名应为字符串',
            'string.empty': '用户名不允许为空',
            'string.min': '用户名长度不能小于2',
            'string.max': '用户名长度不能大于12',
            'any.required': '用户名为必填项'
        }),
        email: Joi.string().email().required().messages({
            'string.base': '邮箱应为字符串',
            'string.empty': '邮箱不允许为空',
            'string.email': '邮箱格式不符合要求',
            'any.required': '邮箱为必填项'
        }),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
            'string.base': '密码应为字符串',
            'string.empty': '密码不允许为空',
            'string.pattern.base': '密码格式不符合要求',
            'any.required': '密码为必填项'
        }),
        role: Joi.string().valid('normal', 'admin').required().messages({
            'string.base': '角色应为字符串',
            'any.only': '角色值非法',
            'any.required': '角色为必填项'
        }),
        state: Joi.number().valid(0, 1).required().messages({
            'number.base': '状态应为数字',
            'any.only': '状态值非法',
            'any.required': '状态为必填项'
        })
    });

    // 实施验证
    return schema.validate(user);
}

// 将用户集合做为模块成员进行导出
module.exports = {
    User,
    validateUser
}
