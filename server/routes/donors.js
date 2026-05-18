const router = require("express").Router();
const Donor = require("../models/Donor");
const auth = require("../middleware/auth");
const authorize = require("../middleware/rbac");

// Any authenticated user can view donors
router.get("/", auth, async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = new RegExp(city, "i");
    const donors = await Donor.find(filter).sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin and staff can add donors
router.post("/", auth, authorize("admin", "staff"), async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin and staff can update donors
router.put("/:id", auth, authorize("admin", "staff"), async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Only admin can delete donors
router.delete("/:id", auth, authorize("admin"), async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: "Donor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;