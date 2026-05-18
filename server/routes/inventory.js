const router = require("express").Router();
const Inventory = require("../models/Inventory");
const auth = require("../middleware/auth");
const authorize = require("../middleware/rbac");

// Any authenticated user can view inventory
router.get("/", auth, async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Only admin and staff can add stock
router.post("/", auth, authorize("admin", "staff"), async (req, res) => {
  try {
    const bloodGroup = req.body.bloodGroup;
    const units = Number(req.body.units) || 0;
    let item = await Inventory.findOne({ bloodGroup });
    if (item) {
      item.units += units;
      item.lastUpdated = new Date();
      await item.save();
    } else {
      item = await Inventory.create({ bloodGroup, units });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Any authenticated user can view low stock alerts
router.get("/alerts", auth, async (req, res) => {
  try {
    const all = await Inventory.find();
    const alerts = all.filter((i) => i.units <= i.lowStockThreshold);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;