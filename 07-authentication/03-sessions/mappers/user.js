module.exports = function mapSessionUser(user) {
    return {
        email: user.email,
        displayName: user.displayName,
    };
}
