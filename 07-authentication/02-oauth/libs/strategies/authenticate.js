const User = require("../../models/User");

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');

    return;
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    try {
      user = await User.create({ email: email, displayName: displayName });
    } catch (error) {
      done(error);

      return;
    }
  }

  done(null, user);
};
