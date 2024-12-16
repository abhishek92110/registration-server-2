const mongoose = require("mongoose");

const ConnectedSchema = new mongoose.Schema({
  
    counselorNo:{
        type:String,
       }, 
    name:{
        type:String,
       }, 
    Course:{
        type:String,
       }, 
    mobile:{
        type:String,
       },    
    day: {
        type: String,         
    },
    month: {
        type: String,              
    },
    year: {
        type: String,           
    },
    date: {
        type: String,           
    },    
    status:{
        type:String,
       },
       id:{
        type:String
       },
       students:{
        type:Object,
       }, 
})

const Connected = new mongoose.model("connecteds", ConnectedSchema);

module.exports = Connected;