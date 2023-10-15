const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const { Schema } = require("mongoose");
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    tasks:[
        {
            type:new mongoose.Schema({
                habbitName: {
                    type: String,
                    required: true,
                },
                Description:{
                    type: String,
                    required: false
                },
                habbitType:{
                    type: String,
                    required: true
                },
                Sunday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Monday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Tuesday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Wednesday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Thursday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Friday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Saturday: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                Month: [
                    {  
                        date: { 
                                type: Number,
                                required: true         
                        },
                        done:{
                                type: Boolean,
                                required: true,
                                default: false
                            }
                    }
                ],
                timeRemind:{
                    type: String,
                    required: true,
                }
            },{
                timestamps:true
            })
        }
    ],
    profilePhoto: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const storage = multer.memoryStorage();

userSchema.statics.uploadDetails = multer().none();
userSchema.statics.uploadPhotos = multer({storage: storage}).single('profile-photo');


const User = mongoose.model('User', userSchema);

module.exports = User;
