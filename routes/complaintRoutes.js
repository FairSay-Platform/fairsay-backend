const express = require("express");
const router = express.Router();

// Middleware
const verifyToken = require("../middleware/authMiddleware");
const requireOnboarding = require("../middleware/requireOnboarding");
const { upload } = require("../config/cloudinary");

// Controller
const {
  createDraftComplaint,
  updateStep2,
  addComplaintParties,
  uploadEvidence,
  submitComplaint,
  getMyComplaints,
  getComplaint,
  submitWhistleblowing
} = require("../controllers/complaintController");

// --- WHISTLEBLOWER ROUTE ---
router.post(
  "/whistleblower-submit", 
  verifyToken, 
  upload.array("files", 5), 
  submitWhistleblowing
);

// Step 1: Create the initial draft
router.post("/", verifyToken, requireOnboarding, createDraftComplaint);

// Step 2: Update incident details (Date, Location, etc.)
router.put("/:id/step-2", verifyToken, requireOnboarding, updateStep2);

// Step 3: Add parties involved (Accused, Witnesses)
router.post("/:id/parties", verifyToken, requireOnboarding, addComplaintParties);

// Step 4: Upload multiple evidence files (Cloudinary)
router.post("/:id/evidence", verifyToken, requireOnboarding, upload.array("files", 5), uploadEvidence);

// Step 5: Final Submission (Generates Tracking ID and closes editing)
router.post("/:id/submit", verifyToken, requireOnboarding, submitComplaint);



// Get all complaints for the logged-in user
router.get("/my-complaints", verifyToken, getMyComplaints);

// Get a specific complaint by Tracking ID
router.get("/:id", verifyToken, getComplaint);

module.exports = router;