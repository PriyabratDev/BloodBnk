const mongoose = require("mongoose");

const BloodRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  hospital: { type: String, required: true },
  contactNumber: String,
  urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["pending", "fulfilled", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.BloodRequest || mongoose.model("BloodRequest", BloodRequestSchema);