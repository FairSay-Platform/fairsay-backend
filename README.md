Your frontend will call endpoints exactly like this:

https://fairsay-backend.onrender.com/api/auth/login

Now I’ll give you the FULL list of EXACT axios URLs for ALL your routes.

🌍 BASE URL
https://fairsay-backend.onrender.com

In frontend, they should define:

const BASE_URL = "https://fairsay-backend.onrender.com";

OR better:

const api = axios.create({
  baseURL: "https://fairsay-backend.onrender.com",
});

🔐 AUTH ENDPOINTS (Exact URLs)
Register
POST https://fairsay-backend.onrender.com/api/auth/register

Login
POST https://fairsay-backend.onrender.com/api/auth/login

Verify Email
GET https://fairsay-backend.onrender.com/api/auth/verify-email?token=EMAIL_TOKEN

Update Profile
PUT https://fairsay-backend.onrender.com/api/auth/profile

Forgot Password
POST https://fairsay-backend.onrender.com/api/auth/forgot-password

Reset Password
POST https://fairsay-backend.onrender.com/api/auth/reset-password/TOKEN

Admin Verify User
PUT https://fairsay-backend.onrender.com/api/auth/admin/verify-user/USER_ID

📁 COMPLAINT ENDPOINTS
Create Draft (Step 1)
POST https://fairsay-backend.onrender.com/api/complaints/

Update Step 2
PUT https://fairsay-backend.onrender.com/api/complaints/COMPLAINT_ID/step-2

Add Parties
POST https://fairsay-backend.onrender.com/api/complaints/COMPLAINT_ID/parties

Upload Evidence
POST https://fairsay-backend.onrender.com/api/complaints/COMPLAINT_ID/evidence

Final Submit
POST https://fairsay-backend.onrender.com/api/complaints/COMPLAINT_ID/submit

Get My Complaints
GET https://fairsay-backend.onrender.com/api/complaints/my-complaints

Get Single Complaint
GET https://fairsay-backend.onrender.com/api/complaints/COMPLAINT_ID

Whistleblower Submit
POST https://fairsay-backend.onrender.com/api/complaints/whistleblower-submit

🤖 AI CHAT
Chat With AI
POST https://fairsay-backend.onrender.com/api/ai/chat
