// 连接数据库

// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost/happy-chat');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;
db.on('error', err => {
  console.log('连接失败', err);
});
db.on('open', () => {
  console.log('连接成功');
});

module.exports = {
  // 发布为模型
  User: mongoose.model('User', require('./user'))
};
