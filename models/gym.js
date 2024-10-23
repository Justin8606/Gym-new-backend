const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        "name":{type:String,required:true},
        "location":{type:String,required:true},
        "price":{type:Number,required:true},
        "equipments":{type:[String],required:true},
        "rating":{type:String,default:null},
        "images": {type: [String], required: false }
    }
)

let gymModel = mongoose.model("gyms",schema)
module.exports = {gymModel}