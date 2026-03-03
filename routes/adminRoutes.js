const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  assignComplaint,
  updateComplaintStatus,
  getAllComplaints,
  getAssignedComplaints,
  submitReport,
  getDashboardStats
} = require("../controllers/adminController");

// Super Admin only
router.get(
  "/complaints",
  verifyToken,
  roleMiddleware("super_admin"),
  getAllComplaints
);

router.patch(
  "/complaints/:id/assign",
  verifyToken,
  roleMiddleware("super_admin"),
  assignComplaint
);

router.patch(
  "/complaints/:id/status",
  verifyToken,
  roleMiddleware("super_admin"),
  updateComplaintStatus
);

// Admin + Investigator
router.get(
  "/my-complaints",
  verifyToken,
  roleMiddleware("admin", "investigator"),
  getAssignedComplaints
);

router.post(
  "/complaints/:id/report",
  verifyToken,
  roleMiddleware("admin", "investigator"),
  submitReport
);

router.get(
  "/dashboard",
  verifyToken,
  roleMiddleware("super_admin", "admin", "investigator"),
  getDashboardStats
);

module.exports = router;
