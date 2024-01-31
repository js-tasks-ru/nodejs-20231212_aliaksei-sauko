const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

const mapUser = require('./mappers/user');

function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    const token = socket.handshake.query.token;
    if (!token) {
      next(new Error("anonymous sessions are not allowed"));

      return;
    }

    const session = await Session.findOne({ token }).populate('user');
    if (!session) {
      next(new Error("wrong or expired session token"));

      return;
    }

    socket.user = mapUser(session.user);

    next();
  });

  io.on('connection', function (socket) {
    socket.on('message', async (msg) => {
      const message = {
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName
      };

      await Message.create(message);
    });
  });

  return io;
}

module.exports = socket;
