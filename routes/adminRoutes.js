const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDonarListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
  deleteHospitalController,
  deleteOrgController,
} = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");
//routes
const router = express.Router();

router.get(
  "/donar-list",
  authMiddleware,
  adminMiddleware,
  getDonarListController
);
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);
router.get("/org-list", authMiddleware, adminMiddleware, getOrgListController);

router.delete(
  "/delete-donar/:id",
  authMiddleware,
  adminMiddleware,
  deleteDonarController
);
router.delete(
  "/delete-hospital/:id",
  authMiddleware,
  adminMiddleware,
  deleteHospitalController
);
router.delete(
  "/delete-org/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrgController
);

module.exports = router;
