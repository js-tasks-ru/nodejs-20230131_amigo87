const Message = require('../models/Message');
const mapper = require('../mappers/message')

module.exports.messageList = async function messages(ctx, next) {

  const list = await Message.find({ user: ctx.user.displayName }).sort({ date: 'desc' }).limit(20)
  
  ctx.body = {
    messages: list ? list.map(mapper) : []
  };
};
