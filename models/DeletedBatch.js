const mongoose = require("mongoose");



const deleteBatchSchema = new mongoose.Schema({
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
    Days: {
        type: String,
    }
})

const deletedBatch = new mongoose.model("DeletedBatches", deleteBatchSchema);

module.exports = deletedBatch;