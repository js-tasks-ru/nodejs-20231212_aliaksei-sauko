const Session = require('../models/Session');
const mapSessionUser = require('../mappers/user');

module.exports = async function mustBeAuthenticated(ctx, next) {
  const authHeader = ctx.request.get('Authorization');
  if (!authHeader) {
    ctx.throw(401, 'Пользователь не залогинен');
  }

  const authValues = authHeader.split(' ', 2);
  const authSchema = authValues[0].toLowerCase();

  if (!authSchema.includes('bearer')) {
    ctx.throw(401, 'Пользователь не залогинен');
  }

  const token = authValues[1];
  const session = await Session.findOne({ token: token }).populate('user');

  if (!session) {
    ctx.throw(401, 'Неверный аутентификационный токен');
  }

  if (!session.user) {
    ctx.throw(404, 'Пользователь не найден');
  }

  await Session.updateOne({ token: token }, { lastVisit: new Date() });

  ctx.user = mapSessionUser(session.user);

  return next();
};
