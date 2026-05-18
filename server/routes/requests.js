const router = require("express").Router();
const BloodRequest = require("../models/BloodRequest");
const Inventory = require("../models/Inventory");
const auth = require("../middleware/auth");
const authorize = require("../middleware/rbac");

// Any authenticated user can view requests
router.get("/", auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ requestedAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Any authenticated user can create a blood request
router.post("/", auth, async (req, res) => {
  try {
    const request = await BloodRequest.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Only admin and staff can fulfill or reject requests
router.put("/:id/status", auth, authorize("admin", "staff"), async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (status === "fulfilled") {
      const inv = await Inventory.findOne({ bloodGroup: request.bloodGroup });
      if (!inv || inv.units < request.units)
        return res.status(400).json({ message: "Insufficient stock" });
      inv.units -= request.units;
      inv.lastUpdated = new Date();
      await inv.save();
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;