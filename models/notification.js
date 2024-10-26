const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users", 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["booking", "message", "system"], // You can customize these types
      required: true 
    },
    read: { 
      type: Boolean, 
      default: false // Indicates if the notification has been read
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

// Create the notification model
let notificationModel = mongoose.model("notifications", schema);

// Export the model
module.exports = { notificationModel };
