// 创建用户集合
const mongoose = require('mongoose');

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

//User.create({
//    username: 'setsuna',
//    email: 'setsuna@myheart.love',
//    password: '123456',
//    role: 'admin',
//    state: 0
//}).then(() => {
//    console.log('用户创建成功')
//}).catch(() => {
//    console.log('用户创建失败')
//})

// 将用户集合作为模块成员进行导出
module.exports = {
    User: User // 可以省略: User
}
