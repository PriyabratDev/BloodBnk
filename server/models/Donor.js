const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  city: String,
  lastDonated: Date,
  isEligible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Donor || mongoose.model("Donor", DonorSchema);