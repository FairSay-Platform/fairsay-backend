const { saveEmployeeVerification, approveUser, rejectUser } = require('../models/employeeVerificationModel');

// USER SUBMISSION
const submitVerification = async (req, res) => {
  try {
    console.log("User ID:", req.user?.id);
    console.log("User ID:", req.user?.id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);   // 👈 add this

    if (!req.file) {
      return res.status(400).json({ message: 'Proof document is required' });
    }

    const proofUrl = req.file.path; // Cloudinary URL

    const { declaration, consentData, consentPrivacy } = req.body;
    
    // converting to real booleans
    const consentDataBool = consentData === 'true' || consentData === true;
    const consentPrivacyBool = consentPrivacy === 'true' || consentPrivacy === true;

    // validation
    if (!consentDataBool || !consentPrivacyBool) {
      return res.status(400).json({
        message: "You must agree to data and privacy consent"
      });
    }

    await saveEmployeeVerification({
      userId: req.user.id,
      declaration,
      proofUrl,
      consentData: consentDataBool,
      consentPrivacy: consentPrivacyBool
      // consentData: consentData === 'true' || consentData === true,
      // consentPrivacy: consentPrivacy === 'true' || consentPrivacy === true
    });
    

    res.json({ message: 'Verification submitted successfully' });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


// ADMIN APPROVE
const approveVerification = async (req, res) => {
  try {
    const superAdminId = req.user.id;
    const { userId } = req.params;
    const { notes } = req.body;

    const result = await approveUser(userId, superAdminId, notes);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or already approved' });
    }

    res.json({ message: 'User verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN REJECT
const rejectVerification = async (req, res) => {
  try {
    const superAdminId = req.user.id;
    const { userId } = req.params;
    const { notes } = req.body;

    const result = await rejectUser(userId, superAdminId, notes);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or already rejected' });
    }

    res.json({ message: 'User rejected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitVerification, approveVerification, rejectVerification };
