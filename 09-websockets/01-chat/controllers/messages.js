const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messageEntities = await Message.find({ chat: ctx.user.id }).limit(20);
  const messages = messageEntities.map(mapMessage);

  ctx.body = {
    messages
  };
};
