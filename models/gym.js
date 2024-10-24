const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        price: { type: Number, required: true },
        equipments: { type: [String], required: true },
        rating: { type: String, default: null },
        images: { type: [String], required: false },
        latitude: { type: Number, required: true },  // Added latitude
        longitude: { type: Number, required: true }  // Added longitude
    }
);

let gymModel = mongoose.model("gyms", schema);
module.exports = { gymModel };
