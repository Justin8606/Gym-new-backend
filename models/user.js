
const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        "name":{type:String,required:true},
        "email":{type:String,required:true},
        "phone":{type:String,required:true},
        "gender":{type:String,required:true},
        "password":{type:String,required:true}
    }
)

let userModel = mongoose.model("users",schema)
module.exports = {userModel}
