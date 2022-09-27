const {User} = require('../models/index');
const jwt = require('jsonwebtoken');
exports.login = async (req, res, next) => {
  try {
    // 处理请求
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (user && password !== user.password) {
      if (password !== user.password) {
        return res.status(400).json({
          error: '密码不正确'
        });
      }
      // 用户存在且密码正确
    } else {
      // 注册,并保存到数据库
      await new User(req.body).save();
    }
    res
      .status(200)
      .send({
        user: {
          username: user.username,
          // 生成token
          token: jwt.sign(
            {
              userId: user._id
            }, // 利用uuid生成一个唯一字符串
            'dbff2563-33a0-4d2e-a4e0-102603a36708',
            {
              expiresIn: '24h' // 设置token过期时间
            }
          )
        }
      })
      .end(); // 一定要结束响应
  } catch (e) {
    next(e);
  }
};
