const db = require("../config/db");
const complaintModel = require("../models/complaintModel");
const generateTrackingId = require("../helpers/generateTrackingId");



// --- WHISTLEBLOWER SUBMISSION CONTROLLER ---
exports.submitWhistleblowing = async (req, res) => {
  console.log("--- START SUBMISSION ---");
  const connection = await db.getConnection();
  console.log("1. Connection Acquired");
  try {
    await connection.beginTransaction();
    console.log("2. Transaction Started");

    const trackingId = await generateTrackingId(connection);
    console.log("3. Tracking ID Generated:", trackingId);

    const complaintId = await complaintModel.submitWhistleblowerReport(
      connection, 
      req.user.id, 
      trackingId, 
      req.body
    );
    console.log("4. Complaint Created, ID:", complaintId);

    if (req.files && req.files.length > 0) {
      console.log(`5. Uploading ${req.files.length} files...`);
      for (const file of req.files) {
        await complaintModel.addEvidence(connection, complaintId, file.path, file.mimetype, "Whistleblower evidence");
      }
    }

    await complaintModel.insertStatusHistory(connection, complaintId, req.user.id, 'submitted');
    console.log("6. History Inserted");

    await connection.commit();
    console.log("7. Transaction Committed");
    res.status(201).json({ success: true, tracking_id: trackingId });

  } catch (err) {
    console.log("!!! ERROR OCCURRED !!!");
    if (connection) await connection.rollback();
    console.error("Submission Error:", err);
    res.status(500).json({ message: "Failed to submit report", error: err.message });
  } finally {
    connection.release();
    console.log("8. Connection Released");
  }
};


// STEP 1
exports.createDraftComplaint = async (req, res) => {
  try {
    const result = await complaintModel.createDraft(req.user.id, req.body);
    res.status(201).json({ message: "Draft created", complaintId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error creating draft", error: err.message });
  }
};

// STEP 2
exports.updateStep2 = async (req, res) => {
  try {
    await complaintModel.updateStep2Data(req.params.id, req.body);
    res.json({ message: "Step 2 details updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// STEP 3
exports.addComplaintParties = async (req, res) => {
  try {
    const { parties } = req.body;
    await complaintModel.addParties(req.params.id, parties);
    res.json({ message: "Parties linked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding parties" });
  }
};


exports.uploadEvidence = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const complaintId = req.params.id;

    // Optional but recommended: verify complaint belongs to user
    const complaint = await complaintModel.getComplaintById(complaintId);

    if (!complaint || complaint.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const uploadPromises = req.files.map(file => {
      return complaintModel.addEvidence(
        db,
        complaintId,
        file.path,             
        file.mimetype,
        req.body.description || null
      );
    });

    await Promise.all(uploadPromises);

    res.status(200).json({
      message: "Evidence uploaded successfully"
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

// STEP 5: Submit with Transaction and Sequential ID
exports.submitComplaint = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const complaint = await complaintModel.getComplaintByIdForUpdate(connection, req.params.id);

    // Validate ownership
    if (!complaint || complaint.user_id !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({ message: "Unauthorized access" });
    }
    // Prevent double submission
    if (complaint.status !== "draft") {
      await connection.rollback();
      return res.status(400).json({ message: `Complaint already ${complaint.status}` });
    }

    // Pass the active connection to ensure the lock works/ Generate tracking ID inside transaction
    const trackingId = await generateTrackingId(connection);
    
    // Update complaint using STATUS
    await complaintModel.markComplaintSubmitted(connection, req.params.id, trackingId);
    await complaintModel.insertStatusHistory(connection, req.params.id, req.user.id, 'submitted');

    await connection.commit();
    res.json({ message: "Submission successful", tracking_id: trackingId });

  } catch (err) {
    await connection.rollback();
    console.error("Submission Error:", err);
    res.status(500).json({ message: "Transaction failed" });
  } finally {
    connection.release();
  }
};

// Get all complaints for the logged-in user
exports.getMyComplaints = async (req, res) => {
  try {
    const [complaints] = await db.execute(
      "SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC", 
      [req.user.id]
    );
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// Get a specific complaint by Tracking ID (or ID)
exports.getComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM complaints WHERE id = ? OR tracking_id = ?", 
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaint" });
  }
};