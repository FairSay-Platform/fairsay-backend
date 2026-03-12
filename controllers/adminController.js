const adminModel = require("../models/adminModel");


// =====================================
// Assign Complaint (Super Admin Only)
// =====================================
exports.assignComplaint = async (req, res) => {
  try {
    const complaintId = parseInt(req.params.id, 10);
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo is required" });
    }

    const complaint = await adminModel.getComplaintById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await adminModel.assignComplaint(complaintId, assignedTo);

    res.json({ message: "Complaint assigned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning complaint" });
  }
};

// =====================================
// Update Complaint Status (Super Admin)
// =====================================
exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = parseInt(req.params.id, 10);
    const { newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ message: "newStatus is required" });
    }

    const complaint = await adminModel.getComplaintById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const allowedTransitions = {
      submitted: ["under_review"],
      under_review: ["investigation"],
      investigation: ["resolved", "rejected"]
    };

    if (
      !allowedTransitions[complaint.status] ||
      !allowedTransitions[complaint.status].includes(newStatus)
    ) {
      return res.status(400).json({
        message: `Cannot move from ${complaint.status} to ${newStatus}`
      });
    }

    await adminModel.updateStatus(complaintId, newStatus);

    res.json({ message: `Status updated to ${newStatus}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating status" });
  }
};

// =====================================
// Submit Investigation Report
// =====================================
exports.submitReport = async (req, res) => {
  try {
    const complaintId = parseInt(req.params.id, 10);
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ message: "Report is required" });
    }

    const complaint = await adminModel.getComplaintById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.assigned_to !== req.user.id) {
      return res.status(403).json({ message: "Not assigned to you" });
    }

    await adminModel.insertReport(complaintId, req.user.id, report);

    res.json({ message: "Report submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting report" });
  }
};

// =====================================
// Get My Assigned Complaints
// =====================================
exports.getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await adminModel.getAssignedComplaints(req.user.id);
    res.json(complaints);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// =====================================
// Get All Complaints (Super Admin)
// =====================================
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await adminModel.getAllComplaints();
    res.json(complaints);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// =====================================
// Dashboard Statistics
// =====================================
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminModel.getDashboardStats(
      req.user.role,
      req.user.id
    );

    res.json(stats);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

// // GET USERS (role-based)
// // adminController.js

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await adminModel.getUsers(req.user.role, req.user.id);

//     if (!users || users.length === 0) {
//       return res.status(404).json({ success: true, data: [], message: "No users found" });
//     }

//     res.json({ success: true, data: users });
//   } catch (err) {
//     console.error("Get users error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// // =====================================
// // Get Users (role-based)
// // super_admin → all users
// // admin/investigator → only users assigned to them via complaints
// // =====================================
// exports.getUsers = async (role, userId) => {
//   let rows;

//   if (role === "super_admin") {
//     [rows] = await db.execute(`
//       SELECT
//         u.id,
//         u.first_name,
//         u.last_name,
//         u.email,
//         u.role,
//         u.email_verified,
//         u.created_at,

//         COALESCE(ev.status, 'not_submitted') AS verification_status,

//         ev.document_path AS proof_url

//       FROM users u
//       LEFT JOIN employee_verifications ev
//         ON u.id = ev.user_id

//       ORDER BY u.created_at DESC
//     `);

//   } else if (["admin", "investigator"].includes(role)) {

//     [rows] = await db.execute(`
//       SELECT DISTINCT
//         u.id,
//         u.first_name,
//         u.last_name,
//         u.email,
//         u.role,
//         u.email_verified,
//         u.created_at,

//         COALESCE(ev.status, 'not_submitted') AS verification_status
//         ev.document_path AS proof_url

//       FROM users u
//       JOIN complaints c
//         ON u.id = c.user_id

//       LEFT JOIN employee_verifications ev
//         ON u.id = ev.user_id

//       WHERE c.assigned_to = ?

//       ORDER BY u.created_at DESC
//     `, [userId]);

//   } else {
//     rows = [];
//   }

//   return rows;
// };

exports.getUsers = async (req, res) => {
  try {
    const { verification, limit = 20, offset = 0 } = req.query;

    const usersResult = await adminModel.getUsers(
      req.user.role,
      req.user.id,
      verification,
      parseInt(limit, 10),
      parseInt(offset, 10)
    );

    res.json({
      success: true,
      data: usersResult.data,
      total_count: usersResult.total_count
    });

  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};