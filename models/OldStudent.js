const mongoose = require("mongoose");

const oldStudentSchema = new mongoose.Schema({

    Name: {
        type: String,
    },
    Number: {
        type: String,
    },
    Pname: {
        type: String,
    },
    Pnumber: {
        type: String,
    },
    BatchStartDate: {
        type: String,

    },
    Course: {
        type: String,

    },
    Counselor: {
        type: String,

    },
    Fees: {
        type: String,

    },
    feesStatus: {
        type: String,

    },
    remainingFees:{
        type:String,
    },
    TrainerName: {
        type: String,

    },

    BatchTiming: {
        type: String,

    },
    BatchMode: {
        type: String,

    },
    Payment: {
        type: String,

    },
    Remark: {
        type: Object,

    },
    file: {
        type: String,

    },
    url: {
        type: String,

    },
    status: {
        type: String,

    },

    PaymentStatus: {
        type: String,

    },
    password: {
        type: String,

    },
    email: {
        type: String,
    },

    Batch: {
        type: String,
    },

    RegistrationFees:
    {
        type: String,
    },
    RegistrationDate:
    {
        type: String,
    },

     CollectionDate: {
        type: Object,

    },

     DueDate: {
        type: Object,

    },
    
    BatchStartingDate:{
        type: String,
    },
    paymentStatus:{
        type: String,
    },
    lastCollectionDate:{
        type: String,
    },

    EnrollmentNo:{
        type: String,
    },
    
    TrainerID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads'
    }, 
    CounselorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'counselors'
    }  
});

const oldStudent = new mongoose.model("oldStudents", oldStudentSchema);


module.exports = oldStudent;