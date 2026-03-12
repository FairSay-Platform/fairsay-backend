// // // // // const nodemailer = require("nodemailer");

// // // // // // Create transporter
// // // // // const transporter = nodemailer.createTransport({
// // // // //   host: "smtp.gmail.com",
// // // // //   port: 587,
// // // // //   secure: true, // true for 465
// // // // //   auth: {
// // // // //     user: process.env.EMAIL_USER,
// // // // //     pass: process.env.EMAIL_PASS, // app password (NO spaces)
// // // // //   },
// // // // // });

// // // // // // Optional: verify connection at startup
// // // // // // transporter.verify((error, success) => {
// // // // // //   if (error) {
// // // // // //     console.error("❌ SMTP Connection Error:", error);

// // // // // //   } else {
// // // // // //     console.log("✅ SMTP Server is ready to send emails");
// // // // // //   }
// // // // // // });

// // // // // // Send email function
// // // // // const sendEmail = async (to, subject, html) => {
// // // // //   try {
// // // // //     const info = await transporter.sendMail({
// // // // //       from: `"Fairsay" <${process.env.EMAIL_USER}>`,
// // // // //       to,
// // // // //       subject,
// // // // //       html,
// // // // //     });

// // // // //     console.log("📧 Email sent successfully!");
// // // // //     console.log("Message ID:", info.messageId);

// // // // //     return info;
// // // // //   } catch (error) {
// // // // //     console.error("❌ Email sending failed:");
// // // // //     console.error("Error message:", error.message);
// // // // //     console.error("Full error:", error);

// // // // //     throw error; // rethrow so controller can catch it
// // // // //   }
// // // // // };

// // // // // module.exports = sendEmail;


// // // // const sgMail = require("@sendgrid/mail");

// // // // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // // // const sendEmail = async (to, subject, html) => {
// // // //   try {
// // // //     const msg = {
// // // //       to,
// // // //       from: process.env.EMAIL_FROM, // must be verified in SendGrid
// // // //       subject,
// // // //       html,
// // // //     };

// // // //     const response = await sgMail.send(msg);

// // // //     console.log("📧 Email sent successfully!");
// // // //     return response;
// // // //   } catch (error) {
// // // //     console.error("❌ SendGrid Email Error:", error.response?.body || error);
// // // //     throw error;
// // // //   }
// // // // };

// // // // module.exports = sendEmail;

// // // const nodemailer = require("nodemailer");

// // // // Create the transporter using Gmail SMTP
// // // const transporter = nodemailer.createTransport({
// // //   service: "gmail",
// // //   secure: true,
// // //   auth: {
// // //     user: process.env.GMAIL_USER,
// // //     pass: process.env.GMAIL_PASS, // The 16-character App Password
// // //   },
// // // });

// // // const sendEmail = async (to, subject, html) => {
// // //   try {
// // //     const mailOptions = {
// // //       from: `"Fairsay App" <${process.env.EMAIL_FROM}>`,
// // //       to,
// // //       subject,
// // //       html,
// // //     };

// // //     const info = await transporter.sendMail(mailOptions);

// // //     console.log("📧 Email sent successfully! Message ID:", info.messageId);
// // //     return info;
// // //   } catch (error) {
// // //     console.error("❌ Gmail SMTP Error:", error);
// // //     throw error;
// // //   }
// // // };

// // // module.exports = sendEmail;

// // const nodemailer = require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false, // Must be false for port 587
// //   requireTLS: true, // Force it to use TLS
// //   auth: {
// //     user: process.env.GMAIL_USER,
// //     pass: process.env.GMAIL_PASS,
// //   },
// //   // Add these to prevent "hanging" in production
// //   connectionTimeout: 10000, // 10 seconds
// //   greetingTimeout: 10000,
// //   socketTimeout: 10000,
// // });

// // const sendEmail = async (to, subject, html) => {
// //   try {
// //     console.log(`📡 Starting SMTP connection for: ${to}`);
    
// //     const mailOptions = {
// //       from: `"Fairsay App" <${process.env.GMAIL_USER}>`,
// //       to,
// //       subject,
// //       html,
// //     };

// //     const info = await transporter.sendMail(mailOptions);
// //     console.log("📧 Email sent successfully! ID:", info.messageId);
// //     return info;
// //   } catch (error) {
// //     // This will now catch the error if the port is blocked or password is wrong
// //     console.error("❌ Mailer Error Details:", {
// //       message: error.message,
// //       code: error.code,
// //       command: error.command
// //     });
// //     return null;
// //   }
// // };

// // module.exports = sendEmail;


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465, // Trying 465 with secure: true is often more stable on Render
//   secure: true, 
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
//   // CRITICAL FIXES FOR RENDER:
//   family: 4,            // Forces IPv4 to avoid ENETUNREACH
//   connectionTimeout: 15000, // Give it 15 seconds
//   greetingTimeout: 15000,
// });

// const sendEmail = async (to, subject, html) => {
//   try {
//     console.log(`📡 Starting SMTP connection for: ${to}`);
    
//     const mailOptions = {
//       from: `"Fairsay App" <${process.env.GMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("📧 Email sent successfully! ID:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Mailer Error Details:", {
//       message: error.message,
//       code: error.code,
//       command: error.command,
//       stack: error.stack
//     });
//     return null;
//   }
// };

// module.exports = sendEmail;



const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps with handshake issues in data centers
  },
  family: 4, // Force IPv4
  connectionTimeout: 20000, // Increase to 20 seconds
  greetingTimeout: 20000,
  logger: true, // This will print the SMTP talk to your logs
  debug: true,  // This will show exactly where it hangs
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`📡 Attempting SMTP connection to: ${to}`);
    
    const mailOptions = {
      from: `"Fairsay App" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully! ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mailer Error Details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return null;
  }
};

module.exports = sendEmail;