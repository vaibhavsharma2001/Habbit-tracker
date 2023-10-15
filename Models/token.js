const { Schema } = require("mongoose");

const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    token:{
        type: String,
        required: true,
    }
},{
    timestamps: true
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 360 });


module.exports = mongoose.model('Token', tokenSchema);