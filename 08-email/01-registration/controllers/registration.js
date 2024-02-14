const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const userData = ctx.request.body;

    const user = new User(userData);
    user.verificationToken = uuid();
    await user.setPassword(userData.password);
    await user.save();

    await sendMail({
        template: 'confirmation',
        locals: { token: user.verificationToken },
        to: user.email,
        from: 'info@08-01.ex',
        subject: 'Подтвердите почту',
    });

    ctx.body = { status: 'ok' };

    next();
};

module.exports.confirm = async (ctx, next) => {

};
