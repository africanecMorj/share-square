const mongoose = require(`mongoose`);

const loginModel = new mongoose.Schema ({
    login: String,
    salt: String,
});
const Logins = mongoose.model(`logins`, loginModel);

module.exports = Logins;
