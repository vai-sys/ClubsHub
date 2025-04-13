const multer = require("multer");
const path = require("path");
const fs = require("fs");


const attachmentsDir = path.join("./uploads", "Attachments");

if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir, { recursive: true });
}


const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg"
];


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, attachmentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});


const fileFilter = (req, file, cb) => {
  if (ALLOWED_ATTACHMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, PNG, JPG, and JPEG formats are allowed for attachments."),
      false
    );
  }
};


const uploadAttachments = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).array("attachments", 10); 

module.exports = uploadAttachments;
