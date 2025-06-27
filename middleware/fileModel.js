const mongoose = require(`mongoose`);

const fileModel = new mongoose.Schema ({
    code: String,
    filePath: String,
    login:String,
});
const File = mongoose.model(`files`, fileModel);

module.exports = File;
