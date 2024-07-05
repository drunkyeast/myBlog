const bcrypt = require('bcrypt');

// 定义要哈希的密码
const password = 'my_secret_password';

// 定义盐的轮数（越高越安全，但也越慢）
const saltRounds = 10;

// 生成哈希密码
bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);

        // 验证密码
        bcrypt.compare(password, hash, function(err, result) {
            if (err) {
                console.error('Error comparing password:', err);
            } else if (result) {
                console.log('Password matches');
            } else {
                console.log('Password does not match');
            }
        });
    }
});

