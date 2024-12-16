const mongoose = require("mongoose");

const CounselorLeadSchema = new mongoose.Schema({
 
    counsellorNo:{
     type:String,
    },
    counsellorName:{
     type:String,
    },
    students:{
        type:Object,
    },
    created_time: {
        type: String,         
    }, 
    assignedDate: {
        type: String,         
    }, 
    id: {
        type: String,         
    },
    adId:{
        type: String, 
    } ,
    adName:{
        type: String, 
    } ,
    campaignName:{
        type: String, 
    } ,
    campaignId:{
        type: String, 
    },
    status:{
        type: String, 
    },
    finalStatus:{
        type: String, 
    },
    finalStatusFrom:{
        type: String, 
    },
    finalDate:{
        type: String, 
    },
    scheduleDate:{
        type: String, 
    },
    remarks:{
        type: String, 
    }

})

const counselorLead = new mongoose.model("counselorLead", CounselorLeadSchema);

module.exports = counselorLead;