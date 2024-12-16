const mongoose = require("mongoose");

const ExpirySchema = new mongoose.Schema({
 
    expiry:{
     type:Number,
    },

})

const expiryModel = new mongoose.model("expiryModels", ExpirySchema);

module.exports = expiryModel;