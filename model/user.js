// 创建用户集合
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

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
        require: true
    },
    password: {
        type: String,
        required: true
    },
    // admin代表超级管理员, normal表示普通用户.
    role: {
        type:String,
        required: true
    },
    // 0启用状态, 1禁用状态
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
        email: 'setsuna@myheart.love',
        password: pass,
        role: 'admin',
        state: 0
    });

}

// createUser();

// 将用户集合作为模块成员进行导出
module.exports = {
    User: User // 可以省略: User
}
