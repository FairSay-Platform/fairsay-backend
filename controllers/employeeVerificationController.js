const {
  saveEmployeeVerification,
  approveUser,
  rejectUser
} = require('../models/employeeVerificationModel');


// USER SUBMISSION
const submitVerification = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Proof document is required"
      });
    }

    const proofUrl = req.file.path;

    const { declaration, consentData, consentPrivacy } = req.body;

    const consentDataBool = consentData === 'true' || consentData === true;
    const consentPrivacyBool = consentPrivacy === 'true' || consentPrivacy === true;

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
    });

      console.log('Flagging user as submitted:', req.user.id);


    res.json({
      message: "Verification submitted successfully",
      status: "pending",
      verification_submitted: true
    });

  } catch (err) {

    console.error("Verification Error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ADMIN APPROVE
const approveVerification = async (req, res) => {

  try {

    const superAdminId = req.user.id;
    const { userId } = req.params;
    const { notes } = req.body;

    await approveUser(userId, superAdminId, notes);

    res.json({
      message: "User verified successfully",
      is_verified: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ADMIN REJECT
const rejectVerification = async (req, res) => {

  try {

    const superAdminId = req.user.id;
    const { userId } = req.params;
    const { notes } = req.body;

    await rejectUser(userId, superAdminId, notes);

    res.json({
      message: "User rejected successfully",
      is_verified: false
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = {
  submitVerification,
  approveVerification,
  rejectVerification
};