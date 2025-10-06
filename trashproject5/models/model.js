const mongoose = require('mongoose');


const objectDBschema = new mongoose.Schema({
    username : { type : String, required: true, unique:true},
    email: {type: String, required:true, unique:true},
    birthdate: {type: Date ,required:true}   
},{timestamps: true});

module.exports =  mongoose.model('user' , objectDBschema);