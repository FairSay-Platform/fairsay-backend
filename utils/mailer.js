// const sgMail = require("@sendgrid/mail");

// // Set the API Key from your environment variables
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (to, subject, html) => {
//   try {
//     console.log(`🚀 SendGrid API attempt for: ${to}`);

//     const msg = {
//       to: to,
//       from: process.env.EMAIL_FROM, // This MUST be verified in your SendGrid dashboard
//       subject: subject,
//       html: html,
//     };

//     const response = await sgMail.send(msg);
    
//     // SendGrid returns an array, the first element contains the status code
//     console.log("📧 SendGrid Success! Status Code:", response[0].statusCode);
//     return response;
//   } catch (error) {
//     console.error("❌ SendGrid API Error:");
    
//     // SendGrid's error object contains a 'response' body with details
//     if (error.response) {
//       console.error(error.response.body);
//     } else {
//       console.error(error.message);
//     }
//     return null;
//   }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`🚀 Nodemailer attempt for: ${to}`);

    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com", // e.g., smtp.gmail.com or smtp.resend.com
      port: process.env.EMAIL_PORT || 465,                    // Port 465 is for Secure SSL
      secure: true,                 // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your App Password (not your regular password)
      },
      family: 4
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // e.g., "Fairsay Support <your-email@gmail.com>"
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("📧 Email Sent! Message ID:", info.messageId);
    return info; 
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    return null;
  }
};

module.exports = sendEmail;



