// // const nodemailer = require("nodemailer");

// // // Create transporter
// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: true, // true for 465
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS, // app password (NO spaces)
// //   },
// // });

// // // Optional: verify connection at startup
// // // transporter.verify((error, success) => {
// // //   if (error) {
// // //     console.error("❌ SMTP Connection Error:", error);

// // //   } else {
// // //     console.log("✅ SMTP Server is ready to send emails");
// // //   }
// // // });

// // // Send email function
// // const sendEmail = async (to, subject, html) => {
// //   try {
// //     const info = await transporter.sendMail({
// //       from: `"Fairsay" <${process.env.EMAIL_USER}>`,
// //       to,
// //       subject,
// //       html,
// //     });

// //     console.log("📧 Email sent successfully!");
// //     console.log("Message ID:", info.messageId);

// //     return info;
// //   } catch (error) {
// //     console.error("❌ Email sending failed:");
// //     console.error("Error message:", error.message);
// //     console.error("Full error:", error);

// //     throw error; // rethrow so controller can catch it
// //   }
// // };

// // module.exports = sendEmail;


// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (to, subject, html) => {
//   try {
//     const msg = {
//       to,
//       from: process.env.EMAIL_FROM, // must be verified in SendGrid
//       subject,
//       html,
//     };

//     const response = await sgMail.send(msg);

//     console.log("📧 Email sent successfully!");
//     return response;
//   } catch (error) {
//     console.error("❌ SendGrid Email Error:", error.response?.body || error);
//     throw error;
//   }
// };

// module.exports = sendEmail;




const sgMail = require("@sendgrid/mail");

// Set the API Key from your environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`🚀 SendGrid API attempt for: ${to}`);

    const msg = {
      to: to,
      from: process.env.EMAIL_FROM, // This MUST be verified in your SendGrid dashboard
      subject: subject,
      html: html,
    };

    const response = await sgMail.send(msg);
    
    // SendGrid returns an array, the first element contains the status code
    console.log("📧 SendGrid Success! Status Code:", response[0].statusCode);
    return response;
  } catch (error) {
    console.error("❌ SendGrid API Error:");
    
    // SendGrid's error object contains a 'response' body with details
    if (error.response) {
      console.error(error.response.body);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

module.exports = sendEmail;