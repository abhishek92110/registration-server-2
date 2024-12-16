const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

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
    subCourse: {
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
    AllTrainer: {
        type: Object,

    },
    AllTrainerId: {
        type: Object,

    },
    OldTrainer: {
        type: Object,

    },
    OldTrainerId: {
        type: Object,

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
    courseRunningStatus: {
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
    studentRunningBatch: {
        type: Object,
    },
    studentOldBatch: {
        type: Object,
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
     InstallmentDate: {
        type: Object,

    },
     Installment: {
        type: Number,

    },
     totalInstallment: {
        type: Number,

    },
     paidFees: {
        type: Number,

    },
     minimumFees: {
        type: Number,

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
        type: String,
    }, 
    CounselorID:{
        type: String,
    },
    RegistrationNo:{
        type: String,
    } 
});

const users = new mongoose.model("studentlists", userSchema);


module.exports = users;