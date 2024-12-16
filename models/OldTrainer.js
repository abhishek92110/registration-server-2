const mongoose = require("mongoose");

const oldTrainerSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Number: {
        type: Number,
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    LinkedinId: {
        type: String
    },
    Course: {
        type: Object
    },
    Batch: {
        type: Object
    },
    Headline: {
        type: String
    },
    bio: {
        type: String
    },
    file: {
        type: String,

    },
    url: {
        type: String,

    },
    Address: {
        type: String
    },
    CompanyName: {
        type: String
    },



});

const oldTrainers = new mongoose.model("oldtrainers", oldTrainerSchema);


module.exports = oldTrainers;