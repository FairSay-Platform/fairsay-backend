# 🛡️ FairSay  
### Empowering Voices, Protecting Identities

**Live API:** https://fairsay-api.onrender.com  
**Status:** 🟢 Operational  

FairSay is a robust, full-stack whistleblowing and grievance reporting platform. It allows individuals to report workplace misconduct, safety violations, or ethical concerns through a secure, streamlined reporting process.

The system prioritizes anonymity while providing a reliable way to track report progress.

---

# 🌟 Key Features

## 🔹 Whistleblower Single-Step Submission
Submit reports with categories, descriptions, and evidence files in one click — no multi-step fatigue.

## 🔹 Multi-Step Complaint Flow
Structured reporting system with draft saving, step updates, and final submission.

## 🔹 AI-Powered Guidance
Integrated AI chat to help whistleblowers understand reporting categories and legal protections.

## 🔹 Sequential Tracking IDs
Generates unique identifiers (e.g., `CPL-2026-000001`) using database row-locking to ensure zero duplicates.

## 🔹 Atomic Transactions
Uses MySQL `BEGIN TRANSACTION` to ensure a complaint is only created if:
- Evidence files upload successfully
- Status history is saved
- All database writes complete

## 🔹 Encrypted Evidence Storage
Automated uploads to Cloudinary with secure URL mapping in the database.

## 🔹 Identity Protection
- `user_id` is stored for personal dashboards
- Public/admin tracking views strip identifying data
- Query-level anonymity enforcement

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- MySQL (mysql2 with Connection Pooling)

## AI Engine
- Google Gemini 3 Flash

## File Management
- Cloudinary API
- Multer

## Security
- JWT Authentication
- Bcrypt Password Hashing
- Dotenv
- Role-Based Access Control

## Deployment
- Render (Free Tier)

---

# 📂 Project Structure

fairsay-backend/
│
├── config/
│ ├── db.js
│ └── cloudinary.js
│
├── controllers/
├── middleware/
├── models/
├── routes/
│
├── server.js
├── package.json
└── .env


---

# 🚀 Getting Started

## 1️⃣ Prerequisites

- Node.js (v18 or higher)
- MySQL Instance (Local or Cloud-hosted)
- Cloudinary Account
- Render Account (for deployment)

---

## 2️⃣ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fairsay-backend.git

# Navigate into project
cd fairsay-backend

# Install dependencies
npm install


3️⃣ Environment Setup

Create a .env file in the root directory:

PORT=5000

DB_HOST=127.0.0.1
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=Fairsaydb

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key



🔌 API Reference
🔐 Authentication Routes (/api/auth)

| Endpoint                 | Method | Auth      | Description                                 |
| ------------------------ | ------ | --------- | ------------------------------------------- |
| `/register`              | POST   | ❌         | Create account & trigger verification email |
| `/verify-email`          | GET    | ❌         | Confirm email using `?token=`               |
| `/login`                 | POST   | ❌         | Authenticate and receive JWT                |
| `/forgot-password`       | POST   | ❌         | Request password reset link                 |
| `/reset-password/:token` | POST   | ❌         | Set new password                            |
| `/profile`               | PUT    | ✅         | Update user profile                         |
| `/admin/verify-user/:id` | PATCH  | ✅ (Admin) | Manually verify a user                      |


## Api intergration

## Auth Routes

# Register

/auth/register


# Login

/auth/login


# Verify Email

/auth/verify-email?token=EMAIL_TOKEN


# Update Profile

/auth/profile


# Forgot Password

/auth/forgot-password


# Reset Password

/auth/reset-password/TOKEN


# Admin Verify User

/auth/admin/verify-user/USER_ID

### Complaint Routes

# Create Draft (Step 1)

/complaints


# Update Step 2

/complaints/COMPLAINT_ID/step-2


# Add Parties

/complaints/COMPLAINT_ID/parties


# Upload Evidence

/complaints/COMPLAINT_ID/evidence


# Final Submit

/complaints/COMPLAINT_ID/submit


# Get My Complaints

/complaints/my-complaints


# Get Single Complaint

/complaints/COMPLAINT_ID


# Whistleblower Submit

/complaints/whistleblower-submit

# AI Routes

# Chat with AI

/ai/chat