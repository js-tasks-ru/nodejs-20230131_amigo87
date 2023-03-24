const socketIO = require('socket.io');
//const socketRedis = require('socket.io-redis')


const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true // false by default
  });
  
  // подключение редис к вэбсокету
  // io.adapter(socketRedis())


  io.use(async function(socket, next) {

    //console.log(socket.handshake.headers)
    //console.log(socket.handshake.query.token)

    if (!socket.handshake.query.token){
      return next(new Error("anonymous sessions are not allowed"))
    }
    const session = await Session.findOne({ token: socket.handshake.query.token }).populate('user')
    
    if(!session){
      return next(new Error("wrong or expired session token"))
    }

    socket.user = session.user
    
    next();
  });


  io.on('connection', function(socket) {
    
    // console.log('connect', socket.id)

    socket.on('message', async (msg) => {
      // console.log('message', msg)

      if (msg && msg.length){
        Message.create({
          date: new Date(),
          text: msg,            // текст сообщения
          chat: socket.user.id, // идентификатор чата, являющийся идентификатором текущего пользователя(т.е.user.id)
          user: socket.user.displayName
        })
      }

    });

    socket.on('disconnect', () => {
      // console.log('client disconnected!')
    });
  });

  return io;
}

module.exports = socket;
