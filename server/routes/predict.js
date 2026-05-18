const router = require("express").Router();
const fetch = require("node-fetch");
const auth = require("../middleware/auth");
const authorize = require("../middleware/rbac");

// Any authenticated user can view predictions
router.get("/", auth, async (req, res) => {
  try {
    const response = await fetch(`${process.env.ML_SERVICE_URL}/predict`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "ML service unavailable", error: err.message });
  }
});

// Only admin can retrain the model
router.post("/retrain", auth, authorize("admin", "staff"), async (req, res) => {
  try {
    const response = await fetch(`${process.env.ML_SERVICE_URL}/retrain`, {
      method: "POST",
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Retrain failed", error: err.message });
  }
});

module.exports = router;