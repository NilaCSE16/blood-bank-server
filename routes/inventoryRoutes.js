const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  getInventoryHospitalController,
  getDonarController,
  getHospitalsController,
  getOrganizationsController,
  getOrganizationForHospitalController,
  getRecentInventoryController,
} = require("../controllers/inventoryController");

const router = express.Router();

router.post("/create-inventory", authMiddleware, createInventoryController);
router.get("/get-inventory", authMiddleware, getInventoryController);
router.get(
  "/get-recent-inventory",
  authMiddleware,
  getRecentInventoryController
);
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);
router.get("/get-donar", authMiddleware, getDonarController);
router.get("/get-hospitals", authMiddleware, getHospitalsController);
router.get("/get-organizations", authMiddleware, getOrganizationsController);
router.get(
  "/get-organization-for-hospital",
  authMiddleware,
  getOrganizationForHospitalController
);

module.exports = router;
