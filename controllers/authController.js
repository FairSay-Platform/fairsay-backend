const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer"); 
const { updateUserProfile } = require("../models/profileModel");
// const { approveUser } = require("../models/verificationModel");

const {
  createUser,
  findUserByEmail,
  verifyUserEmail,
  updateLastLogin,
  updatePassword,
  verifyUserEmailById
} = require("../models/userModel");

const {
  createResetToken,
  findResetToken,
  markTokenUsed,
  deleteUserTokens
} = require("../models/passwordResetModel");



// REGISTER
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(20).toString("hex");

    await createUser(
      first_name,
      last_name,
      email,
      password_hash,
      "user",
      emailToken
    );
  

    // SEND VERIFICATION EMAIL
    const verificationLink =
      `${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailToken}`;

    const html = `
      <h2>Email Verification</h2>
      <p>Hello ${first_name},</p>
      <p>Please click the button below to verify your email:</p>
      <a href="${verificationLink}" 
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
         Verify Email
      </a>
    `;

    await sendEmail(email, "Verify Your Email", html);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });

  } catch (error) {
    console.error("Register route error:", error); 
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};



// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

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


// RESEND VERIFICATION EMAIL
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const emailToken = crypto.randomBytes(20).toString("hex");

    // update token in database
    await verifyUserEmailById(user.id, emailToken);

    const verificationLink =
      `${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailToken}`;

    const html = `
      <h2>Email Verification</h2>
      <p>Hello ${user.first_name},</p>
      <p>Please click the button below to verify your email:</p>
      <a href="${verificationLink}" 
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
         Verify Email
      </a>
    `;

    await sendEmail(email, "Verify Your Email", html);

    res.json({ message: "Verification email resent successfully" });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
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
        email_verified: user.email_verified,
        profile_completed: user.profile_completed,
        course_completed: user.course_completed,
        lessons_completed: user.lessons_completed,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update User profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await updateUserProfile(userId, req.body);

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
