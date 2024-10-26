const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: "gyms", required: true }, // assuming you have a "gyms" model
    bookingDate: { type: Date, required: true },
    timeSlot: { 
      type: String, 
      required: true, 
      enum: ["morning", "evening"], 
    },
    status: { 
      type: String, 
      default: "pending", 
      enum: ["pending", "confirmed", "cancelled"], 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

let bookingModel = mongoose.model("bookings", schema);
module.exports = { bookingModel };
