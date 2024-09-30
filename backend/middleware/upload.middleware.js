const multer = require("multer")
const path = require('path');
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads/'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  };
  
  const upload = multer({ storage, fileFilter });

  module.exports = upload