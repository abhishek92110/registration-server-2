const mongoose = require("mongoose");



const runningBatchSchema = new mongoose.Schema({
    Batch: {
        type: String,

    },
    Trainer: {
        type: String,

    },
    
    TrainerID: {
        type: String,

    },
    BatchTime: {
        type: String,

    },
    courseName: {
        type: String,

    },
    Days: {
        type: String,
    }
})

const runningBatch = new mongoose.model("RunningBatches", runningBatchSchema);

module.exports = runningBatch;