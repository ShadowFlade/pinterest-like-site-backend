const { MongoClient, ServerApiVersion } = require('mongodb');
const cloudinary = require('cloudinary').v2;

const client = new MongoClient(process.env.SECRET_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

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
					console.error(`${error} Error`);
				}
				return result;
			}
		);
	} catch (e) {
		console.error(e);
	}
};

async function run() {
	try {
		client.connect();
		console.log('connected');
	} catch (e) {
		console.error(e, 'Client could not connect');
	}
}
run();
module.exports = { client, upload };
