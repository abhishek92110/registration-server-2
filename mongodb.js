const mongoose = require('mongoose');

async function dbConnect() {
    mongoose.connect('mongodb://0.0.0.0:27017/Login')    //data base Name
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log("Mongo Error", err));
}
module.exports = dbConnect;