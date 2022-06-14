const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary').v2;

const client = new MongoClient(process.env.SECRET_URI);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = ({ img, id }) => {
	try {
		return cloudinary.uploader.upload(
			img,
			{ detection: 'cld-fashion', auto_tagging: 0.6 },
			function (error, result) {
				if (error) {
					console.error(error, 'ERROR');
				}
				return result;
			}
		);
	} catch (e) {
		console.error(e);
	}
};
try {
	client.connect();
} catch (e) {
	console.error(e, 'Client could not connect');
}

module.exports = { client, upload };
