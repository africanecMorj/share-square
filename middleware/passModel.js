const mongoose = require(`mongoose`);

const passModel = new mongoose.Schema ({
    hash:String,
});
const Pass = mongoose.model(`passwords`, passModel);

module.exports = Pass;
