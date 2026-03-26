const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer"); 
const { updateUserProfile } = require("../models/profileModel");
const { OAuth2Client } = require("google-auth-library");
// const { approveUser } = require("../models/verificationModel");

const {
  createUser,
  findUserByEmail,
  verifyUserEmail,
  updateLastLogin,
  updatePassword,
  findUserById,
  verifyUserEmailById,
  updateVerificationToken,
  updateUser
} = require("../models/userModel");

const {
  createResetToken,
  findResetToken,
  markTokenUsed,
  deleteUserTokens
} = require("../models/passwordResetModel");



exports.register = async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body;

    email = email.trim().toLowerCase();

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Create user FIRST
    await createUser(
      first_name,
      last_name,
      email,
      password_hash,
      "user",
      null,   // no token needed for now
      null
    );

    // Try sending email (but DO NOT break anything if it fails)
    try {
      const html = `<h2>Welcome ${first_name}</h2><p>Your account has been created.</p>`;
      await sendEmail(email, "Welcome to Fairsay", html);
      console.log(" Email sent");
    } catch (emailError) {
      console.error(" Email failed but user created:", emailError.message);
    }

    // ALWAYS SUCCESS RESPONSE
    res.status(201).json({
      message: "Registration successful. You can now login.",
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.register = async (req, res) => {
//   try {
//     let { first_name, last_name, email, password } = req.body;

//     email = email.trim().toLowerCase();

//     if (!first_name || !last_name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await findUserByEmail(email);

//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const password_hash = await bcrypt.hash(password, 10);

//     // STEP 1: Generate RAW token
//     const rawToken = crypto.randomBytes(32).toString("hex");

//     // STEP 2: Hash token
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(rawToken)
//       .digest("hex");

//     const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

//     // STEP 3: Store HASHED token
//     await createUser(
//       first_name,
//       last_name,
//       email,
//       password_hash,
//       "user",
//       hashedToken,
//       tokenExpiry
//     );

//     // STEP 4: Send RAW token
//     const verificationLink =
//       `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;

//     console.log("Generated Verification link:", verificationLink);

//     const html = `
//       <h2>Email Verification</h2>
//       <p>Hello ${first_name},</p>
//       <p>Please verify your email:</p>
//       <a href="${verificationLink}">Verify Email</a>
//       <p>This link expires in 24 hours.</p>
//     `;

//     await sendEmail(email, "Verify Your Email", html);

//     res.status(201).json({
//       message: "User registered successfully. Please verify your email.",
//     });

//   } catch (error) {
//     console.error("Register error:", error); 
//     res.status(500).json({ message: "Server error" });
//   }
// };



// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {

  try {

    const { token } = req.query;
    console.log("--- DEBUG VERIFICATION ---");
    console.log("Token from URL:", token);
    console.log("Token Length:", token?.length);

    const user = await verifyUserEmail(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/sign-in?verified=true`
    );
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    // Generate raw token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash it
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store hashed
    await updateVerificationToken(
      user.id,
      hashedToken,
      tokenExpiry
    );

    // Send raw
    const verificationLink =
      `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;

  //   const verificationLink =
  // `http://localhost:5000/api/auth/verify-email?token=${rawToken}`;
      
    const html = `
      <h2>Email Verification</h2>
      <p>Hello ${user.first_name},</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await sendEmail(email, "Verify Your Email", html);

    res.json({
      message: "Verification email resent successfully"
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    await updateLastLogin(user.id);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,

        email_verified: Boolean(user.email_verified),

        profile_completed: Boolean(user.profile_completed),
        verification_submitted: Boolean(user.verification_submitted),

        is_verified: Boolean(user.is_verified),

        verification_status: user.is_verified
          ? "approved"
          : user.verification_submitted
          ? "pending"
          : "not_submitted",

        course_completed: Boolean(user.course_completed),

        lessons_completed: Number(user.lessons_completed || 0),
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET CURRENT USER (restore session)
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,

        email_verified: Boolean(user.email_verified),

        profile_completed: Boolean(user.profile_completed),
        verification_submitted: Boolean(user.verification_submitted),

        is_verified: Boolean(user.is_verified),

        verification_status: user.is_verified
          ? "approved"
          : user.verification_submitted
          ? "pending"
          : "not_submitted",

        course_completed: Boolean(user.course_completed),

        lessons_completed: Number(user.lessons_completed || 0),
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    await updateUserProfile(userId, req.body);

    res.json({
      message: "Profile updated successfully",
      profile_completed: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};


//  FORGOT PASSWORD

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({ message: "If email exists, reset link sent" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await createResetToken(user.id, hashedToken, expiresAt);

    const frontendURL = process.env.FRONTEND_URL;
    if (!frontendURL) {
      throw new Error("FRONTEND_URL is not defined in environment variables");
    }

    const resetURL = `${frontendURL}/reset-password/${rawToken}`;
     await sendEmail(
      email,
      "Password Reset Request",
      `
        <h2>Password Reset</h2>
        <p>Hello ${user.first_name},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetURL}" 
           style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
           Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `
    );  

    res.json({ message: "If email exists, reset link sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//  RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const record = await findResetToken(hashedToken);

    if (!record || new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updatePassword(record.user_id, hashedPassword);
    await markTokenUsed(record.id);
    await deleteUserTokens(record.user_id);

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
