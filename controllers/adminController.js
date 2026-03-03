// const db = require("../config/db");

// /**
//  * 👑 SUPER ADMIN
//  * Assign complaint to admin or investigator
//  */
// exports.assignComplaint = async (req, res) => {
//   try {
//     const complaintId = parseInt(req.params.id, 10);
//     const { assignedTo } = req.body;

//     if (!assignedTo) {
//       return res.status(400).json({ message: "assignedTo is required" });
//     }

//     // Ensure complaint exists
//     const [rows] = await db.execute(
//       "SELECT * FROM complaints WHERE id = ?",
//       [complaintId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     // Update assignment + move to under_review
//     await db.execute(
//       `UPDATE complaints 
//        SET assigned_to = ?, status = 'under_review', updated_at = NOW()
//        WHERE id = ?`,
//       [assignedTo, complaintId]
//     );

//     res.json({ message: "Complaint assigned successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error assigning complaint" });
//   }
// };


// /**
//  * 👑 SUPER ADMIN
//  * Update complaint status (Controlled transitions)
//  */
// exports.updateComplaintStatus = async (req, res) => {
//   try {
//     const complaintId = parseInt(req.params.id, 10);
//     const { newStatus } = req.body;

//     if (!newStatus) {
//       return res.status(400).json({ message: "newStatus is required" });
//     }

//     const [rows] = await db.execute(
//       "SELECT status FROM complaints WHERE id = ?",
//       [complaintId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     const currentStatus = rows[0].status;

//     const allowedTransitions = {
//       submitted: ["under_review"],
//       under_review: ["investigation"],
//       investigation: ["resolved", "rejected"]
//     };

//     if (
//       !allowedTransitions[currentStatus] ||
//       !allowedTransitions[currentStatus].includes(newStatus)
//     ) {
//       return res.status(400).json({
//         message: `Cannot move from ${currentStatus} to ${newStatus}`
//       });
//     }

//     await db.execute(
//       `UPDATE complaints
//        SET status = ?, updated_at = NOW()
//        WHERE id = ?`,
//       [newStatus, complaintId]
//     );

//     res.json({ message: `Status updated to ${newStatus}` });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating status" });
//   }
// };


// /**
//  * 👑 SUPER ADMIN
//  * View all complaints
//  */
// exports.getAllComplaints = async (req, res) => {
//   try {
//     const [complaints] = await db.execute(
//       "SELECT * FROM complaints ORDER BY created_at DESC"
//     );

//     res.json({ complaints });

//   } catch (err) {
//     res.status(500).json({ message: "Error fetching complaints" });
//   }
// };


// /**
//  * 🧑‍💼 ADMIN / 🕵️ INVESTIGATOR
//  * View only assigned complaints
//  */
// exports.getAssignedComplaints = async (req, res) => {
//   try {
//     const [complaints] = await db.execute(
//       `SELECT * FROM complaints 
//        WHERE assigned_to = ?
//        ORDER BY created_at DESC`,
//       [req.user.id]
//     );

//     res.json({ complaints });

//   } catch (err) {
//     res.status(500).json({ message: "Error fetching assigned complaints" });
//   }
// };


// /**
//  * 🧑‍💼 ADMIN / 🕵️ INVESTIGATOR
//  * Submit investigation report
//  */
// exports.submitReport = async (req, res) => {
//   try {
//     const complaintId = parseInt(req.params.id, 10);
//     const { report } = req.body;

//     if (!report) {
//       return res.status(400).json({ message: "Report is required" });
//     }

//     // Ensure complaint is assigned to this user
//     const [rows] = await db.execute(
//       "SELECT assigned_to FROM complaints WHERE id = ?",
//       [complaintId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     if (rows[0].assigned_to !== req.user.id) {
//       return res.status(403).json({ message: "Not assigned to you" });
//     }

//     await db.execute(
//       `INSERT INTO complaint_reports
//        (complaint_id, investigator_id, report)
//        VALUES (?, ?, ?)`,
//       [complaintId, req.user.id, report]
//     );

//     res.json({ message: "Report submitted successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error submitting report" });
//   }
// };


// exports.getDashboardStats = async (req, res) => {
//   try {
//     let query = `
//       SELECT 
//         COUNT(*) as total,
//         SUM(status = 'submitted') as submitted,
//         SUM(status = 'under_review') as under_review,
//         SUM(status = 'investigation') as investigation,
//         SUM(status = 'resolved') as resolved,
//         SUM(status = 'rejected') as rejected
//       FROM complaints
//     `;

//     let params = [];

//     // If not super admin, only count assigned complaints
//     if (req.user.role !== "super_admin") {
//       query += " WHERE assigned_to = ?";
//       params.push(req.user.id);
//     }

//     const [rows] = await db.execute(query, params);

//     res.json({ stats: rows[0] });

//   } catch (err) {
//     res.status(500).json({ message: "Error fetching dashboard stats" });
//   }
// };



// const adminModel = require("../models/adminModel");

// exports.assignComplaint = async (req, res) => {
//   try {
//     const complaintId = parseInt(req.params.id, 10);
//     const { assignedTo } = req.body;

//     if (!assignedTo) {
//       return res.status(400).json({ message: "assignedTo is required" });
//     }

//     const complaint = await adminModel.getComplaintById(complaintId);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     await adminModel.assignComplaint(complaintId, assignedTo);

//     await adminModel.logActivity(
//       complaintId,
//       req.user.id,
//       "under_review",
//       "Complaint assigned"
//     );

//     res.json({ message: "Complaint assigned successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error assigning complaint" });
//   }
// };

// exports.updateComplaintStatus = async (req, res) => {
//   try {
//     const complaintId = parseInt(req.params.id, 10);
//     const { newStatus } = req.body;

//     if (!newStatus) {
//       return res.status(400).json({ message: "newStatus is required" });
//     }

//     const complaint = await adminModel.getComplaintById(complaintId);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     const allowedTransitions = {
//       submitted: ["under_review"],
//       under_review: ["investigation"],
//       investigation: ["resolved", "rejected"]
//     };

//     if (
//       !allowedTransitions[complaint.status] ||
//       !allowedTransitions[complaint.status].includes(newStatus)
//     ) {
//       return res.status(400).json({
//         message: `Cannot move from ${complaint.status} to ${newStatus}`
//       });
//     }

//     await adminModel.updateStatus(complaintId, newStatus);

//     await adminModel.logActivity(
//       complaintId,
//       req.user.id,
//       newStatus,
//       "Status updated"
//     );

//     res.json({ message: `Status updated to ${newStatus}` });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating status" });
//   }
// };


// exports.submitReport = async (req, res) => {
//   try {
//     const complaintId = parseInt(req.params.id, 10);
//     const { report } = req.body;

//     if (!report) {
//       return res.status(400).json({ message: "Report is required" });
//     }

//     const complaint = await adminModel.getComplaintById(complaintId);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     if (complaint.assigned_to !== req.user.id) {
//       return res.status(403).json({ message: "Not assigned to you" });
//     }

//     await adminModel.insertReport(complaintId, req.user.id, report);

//     await adminModel.logActivity(
//       complaintId,
//       req.user.id,
//       "report_submitted",
//       "Investigation report submitted"
//     );

//     res.json({ message: "Report submitted successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error submitting report" });
//   }
// };



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