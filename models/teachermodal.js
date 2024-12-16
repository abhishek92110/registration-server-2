const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   
     name: {
         type: String 
     },
     dept: {
         type: String 
     },
     trainerId: {
         type: String 
     }  



});

const uploads = new mongoose.model("trainers", userSchema);


module.exports = uploads;