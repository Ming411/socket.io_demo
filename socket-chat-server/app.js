const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const router = require('./router');
const {User} = require('./models/index');
/* 配置解析post请求体,将解析的数据挂载到req.body上 */
app.use(express.json());

// 给http接口提供cors跨域处理
app.use(cors());
app.use('/api', router);

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
  cors: {
    // 允许所有人连接
    origin: '*'
  }
});

// socket通信中间件
// 只有当用户登录的才让他建立socket通信
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // 唯一值需要与创建时保持一致
  jwt.verify(token, 'dbff2563-33a0-4d2e-a4e0-102603a36708', async (err, data) => {
    // console.log(err, data);
    if (err) {
      //  未登录
      next(new Error('身份验证失败'));
    }
    //  验证成功
    const user = await User.findById(data.userId);
    console.log('认证通过');
    // 将查到的数据挂载给后续使用
    socket.request.user = user;
    next();
  });
});

// 处理http的express实例
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// 存储所有的客户端
const clients = [];

// 处理websocket的socket.io实例
io.on('connection', socket => {
  clients.push(socket);
  console.log('a user connected');
  // 发送消息 socket.emit('消息类型',数据)
  // 接收消息 socket.on('消息类型',数据=>{})

  socket.on('chat message', data => {
    // console.log(data);
    // 默认发送给接收到该数据的客户端
    // socket.emit('chat message', data);
    /* 发送给所有客户端,通过遍历以及自己维护用户是否在线，不推荐， */
    /*    clients.forEach(item => {
      item.emit('chat message', '群发的消息');
    });   */
    // 内置的群发API
    // io.emit('chat message', '发给所有用户');
    io.emit('chat message', {
      nickname: socket.request.user.username,
      message: data
    });
    // socket.broadcast.emit('chat message', '发给不包括当前客户端的所有用户');
  });
  socket.on('disconnect', () => {
    // console.log('有客户端断开了连接');
    const index = clients.findIndex(item => item === socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
