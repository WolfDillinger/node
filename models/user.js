const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fName: {
        type: String,
        required: true,
        trim: true,
    },
    lName: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
        //default:'user',
    },
    date:{
        type: String,
    },
    token:{
        type: String,
    },
    countrycode:{
        type: String,
    },
    country:{
        type: String,
    },
});

const User = mongoose.model('User', userSchema);

module.exports=User;
