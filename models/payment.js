const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "bookings", required: true },
    amount: { type: Number, required: true }, // Total payment amount
    currency: { type: String, default: "INR" }, // Razorpay typically defaults to INR
    status: { type: String, enum: ["created", "completed", "failed"], default: "created" },
    paymentId: { type: String }, // Razorpay payment ID after successful payment
    orderId: { type: String, required: true }, // Razorpay order ID
    receipt: { type: String }, // Custom receipt or transaction ID
  },
  { timestamps: true }
);

let paymentModel = mongoose.model("payments", schema);
module.exports = { paymentModel };
