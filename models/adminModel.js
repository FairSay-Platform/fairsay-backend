const db = require("../config/db");

// Get complaint by ID
exports.getComplaintById = async (complaintId) => {
  const [rows] = await db.execute(
    "SELECT * FROM complaints WHERE id = ?",
    [complaintId]
  );
  return rows[0];
};

// Update assignment + status
exports.assignComplaint = async (complaintId, assignedTo) => {
  await db.execute(
    `UPDATE complaints
     SET assigned_to = ?, status = 'under_review', updated_at = NOW()
     WHERE id = ?`,
    [assignedTo, complaintId]
  );
};

// Update complaint status
exports.updateStatus = async (complaintId, newStatus) => {
  await db.execute(
    `UPDATE complaints
     SET status = ?, updated_at = NOW()
     WHERE id = ?`,
    [newStatus, complaintId]
  );
};

// Insert report
exports.insertReport = async (complaintId, userId, report) => {
  await db.execute(
    `INSERT INTO complaint_reports
     (complaint_id, investigator_id, report)
     VALUES (?, ?, ?)`,
    [complaintId, userId, report]
  );
};

// Get assigned complaints
exports.getAssignedComplaints = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM complaints
     WHERE assigned_to = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

// Get all complaints (Super Admin)
exports.getAllComplaints = async () => {
  const [rows] = await db.execute(
    `SELECT * FROM complaints
     ORDER BY created_at DESC`
  );
  return rows;
};

// Dashboard stats
exports.getDashboardStats = async (role, userId) => {
  let query = `
    SELECT 
      COUNT(*) as total,
      SUM(status = 'submitted') as submitted,
      SUM(status = 'under_review') as under_review,
      SUM(status = 'investigation') as investigation,
      SUM(status = 'resolved') as resolved,
      SUM(status = 'rejected') as rejected
    FROM complaints
  `;

  let params = [];

  if (role !== "super_admin") {
    query += " WHERE assigned_to = ?";
    params.push(userId);
  }

  const [rows] = await db.execute(query, params);
  return rows[0];
};


exports.getUsers = async (role, userId, verification, limit = 20, offset = 0) => {
  let rows = { data: [], total_count: 0 };
  let params = [];
  let countParams = [];

  // 1. Force strict integer types for MySQL LIMIT/OFFSET
  const cleanLimit = parseInt(limit, 10) || 20;
  const cleanOffset = parseInt(offset, 10) || 0;

  try {
    // --- SUPER ADMIN BLOCK ---
    if (role === "super_admin") {
      let query = `
        SELECT
          u.id, u.first_name, u.last_name, u.email, u.role, u.email_verified, u.created_at,
          COALESCE(ev.status, 'not_submitted') AS verification_status,
          ev.document_path AS proof_url,
          p.job_title, p.department, p.company_name, p.location, p.phone
        FROM users u
        LEFT JOIN employee_verifications ev ON u.id = ev.user_id
        LEFT JOIN user_profiles p ON u.id = p.user_id
      `;

      let countQuery = `
        SELECT COUNT(*) AS total_count
        FROM users u
        LEFT JOIN employee_verifications ev ON u.id = ev.user_id
      `;

      if (verification) {
        query += ` WHERE COALESCE(ev.status,'not_submitted') = ?`;
        countQuery += ` WHERE COALESCE(ev.status,'not_submitted') = ?`;
        params.push(verification);
        countParams.push(verification);
      }

      query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
      params.push(cleanLimit, cleanOffset);

      const [userRows] = await db.query(query, params);
      const [countRows] = await db.query(countQuery, countParams);

      rows = {
        data: userRows,
        total_count: countRows[0].total_count
      };
    }

    // --- ADMIN / INVESTIGATOR BLOCK ---
    else if (["admin", "investigator"].includes(role)) {
      let query = `
        SELECT DISTINCT
          u.id, u.first_name, u.last_name, u.email, u.role, u.email_verified, u.created_at,
          COALESCE(ev.status,'not_submitted') AS verification_status,
          ev.document_path AS proof_url,
          p.job_title, p.department, p.company_name, p.location, p.phone
        FROM users u
        JOIN complaints c ON u.id = c.user_id
        LEFT JOIN employee_verifications ev ON u.id = ev.user_id
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE c.assigned_to = ?
      `;

      let countQuery = `
        SELECT COUNT(DISTINCT u.id) AS total_count
        FROM users u
        JOIN complaints c ON u.id = c.user_id
        LEFT JOIN employee_verifications ev ON u.id = ev.user_id
        WHERE c.assigned_to = ?
      `;

      params.push(userId);
      countParams.push(userId);

      if (verification) {
        query += ` AND COALESCE(ev.status,'not_submitted') = ?`;
        countQuery += ` AND COALESCE(ev.status,'not_submitted') = ?`;
        params.push(verification);
        countParams.push(verification);
      }

      query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
      params.push(cleanLimit, cleanOffset);

      const [userRows] = await db.query(query, params);
      const [countRows] = await db.query(countQuery, countParams);

      rows = {
        data: userRows,
        total_count: countRows[0].total_count
      };
    }

    return rows;

  } catch (error) {
    console.error("Get users error in Model:", error);
    throw error; 
  }
};