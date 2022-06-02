const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/gi, '') + '-' + file.originalname);
  },
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb('Type of file is not allowed', false);
  }
};

const uploadFile = multer({
  storage,
  fileFilter,
});
module.exports = { uploadFile };
