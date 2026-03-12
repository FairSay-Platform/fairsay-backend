const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fairsay_evidence', // This folder will be created in your Cloudinary media library,
    resource_type: "auto",
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf','doc','docx'], 
    transformation: [{ width: 1000, crop: "limit" }] 
  },
});

// // Initialize Multer with the Cloudinary storage
// const upload = multer({ storage: storage });


const allowedTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/jpg"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, JPG, PNG allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter
});

module.exports = { cloudinary, upload };