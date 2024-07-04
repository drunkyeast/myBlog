const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
// 连接数据库
mongoose.connect('mongodb://localhost/blog')
  .then(() => console.log('数据库连接成功'))
  .catch(() => console.error('数据库连接失败'));

