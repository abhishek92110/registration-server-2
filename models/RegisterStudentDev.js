const mongoose = require("mongoose");

const RegisterStudentDevSchema = new mongoose.Schema({

    RegistrationNo: {
        type: String,

    },
    Name: {
        type: String,

    },
    Email: {
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

    RegistrationDate: {
        type: String,

    }, 

    RegistrationFees: {
        type: String,

    },
    EMI: {
        type: String,

    },
    totalInstallment: {
        type: String,

    },

    Course: {
        type: String,
    },

    Counselor: {
        type: String,

    },
    counselorNumber: {
        type: String,

    },
    CounselorId: {
        type: String,

    },

    RegistrationFees: {
        type: String,

    },
    CourseFees: {
        type: String,

    },
    RemainingFees: {
        type: String,

    },
    PaymentMethod: {
        type: String,

    },
    joinTime: {
        type: String,

    },
    joinDate: {
        type: String,

    },
  
    RegistrationNo: {
        type: String,

    },

    PaymentMode: {
        type: String,

    },

    TrainerName: {
        type: String,

    },
    
    TrainerId: {
        type: String,

    },

    BatchMode: {
        type: String,

    },

    BatchTiming: {
        type: String,

    },
    subCourse: {
        type: String,

    },

    Remark: {
        type: String,
    },
    status: {
        type: String,
    },

    month:{
        type: String,
    },
    year:{
        type: String,
    },
    index:{
        type: String,
    },
    courseCode:{
        type: String,
    }

});

const registerStudentDev = new mongoose.model("registeredStudentsdevs", RegisterStudentDevSchema);


module.exports = registerStudentDev;