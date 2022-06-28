const multer = require('multer');
const fs = require('fs');
const path = require('path');
const storage = multer.diskStorage({
	destination(req, file, cb) {
		const directory = path.resolve(__dirname, 'images');
		console.log('🚀 ~ file: fileMW.js ~ line 7 ~ destination ~ directory', directory);
		if (!fs.existsSync(directory)) {
			console.log('doesnot exist');
			fs.mkdir(directory, (e) => {
				if (e) {
					console.log(e);
				}
			});
		}

		cb(null, directory);
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
