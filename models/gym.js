// const mongoose = require("mongoose");

// const schema = mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         location: { type: String, required: true },
//         price: { type: Number, required: true },
//         equipments: { type: [String], required: true },
//         rating: { type: String, default: null },
//         images: { type: [String], required: false },
//         latitude: { type: Number, required: true },  // Added latitude
//         longitude: { type: Number, required: true }  // Added longitude
//     }
// );

// let gymModel = mongoose.model("gyms", schema);
// module.exports = { gymModel };


const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    equipments: { type: [String], required: true },
    rating: { type: String, default: null },
    images: { type: [String], required: false },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    specialFacilities: { type: [String], required: false },  // New field
    classesOffered: { type: [String], required: false },     // New field
    personalTrainers: { type: [String], required: false },   // New field
    lockerRoom: { type: Boolean, default: false },           // New field
    showers: { type: Boolean, default: false }               // New field
  }
);

let gymModel = mongoose.model("gyms", schema);
module.exports = { gymModel };
