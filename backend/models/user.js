const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    fullname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    createdon:{type:Date,default:Date.now}
}); 
module.exports = mongoose.model("users",userSchema);