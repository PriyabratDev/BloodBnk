const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    unique: true,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
  units: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);