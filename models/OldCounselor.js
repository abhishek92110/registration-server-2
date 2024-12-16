const mongoose = require("mongoose");

const oldCounselorSchema = new mongoose.Schema({


    Name: {
        type: String,

    },
    Number: {
        type: String,

    },
    Email: {
        type: String,


    },
    password: {
        type: String,


    },
    Address: {
        type: String,

    },

    file: {
        type: String,

    },
    url: {
        type: String,

    }

});

const oldCounselors = new mongoose.model("oldcounselors", oldCounselorSchema);


module.exports = oldCounselors;