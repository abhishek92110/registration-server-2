const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: {
        type: String    
    },
    InvoiceNumber: {
        type: String
    },
    Paymentmode: {
        type: String
    },
    amount: {
        type: String
    },
    month: {
        type: String
    },
    day: {
        type: String
    },
    year: {
        type: String
    },
    Detail: {
        type: String
    },
    CollectionDate: {
       type:String
    },
    installment: {
        type: String
    },
    file: {
        type: String,

    },
    url: {
        type: String,
    },
    Name:{
        type:String,
    },
    EnrollmentNo: {
        type:String,
    },
    Batch:{
        type:String,
    },
    CounselorId: {
        type:String,
    },
    Counselor: {
        type:String,
    },
    Phone: {
        type:Number,
    }
});

const StudentFee = new mongoose.model("StudentFee", userSchema);


module.exports = StudentFee;