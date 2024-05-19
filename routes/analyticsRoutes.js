const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  bloodGroupDetailsController,
} = require("../controllers/analyticController");

const router = express.Router();

router.get("/bloodGroup-data", authMiddleware, bloodGroupDetailsController);

module.exports = router;