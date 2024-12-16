const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({

  Name: {
    type: String,

  },
  Number: {
    type: Number,

  },

  password: {
    type: String,

  },
  email: {
    type: String,

  },
  status: {
    type: String,

  },

});

const admins = new mongoose.model("admins", AdminSchema);


module.exports = admins;