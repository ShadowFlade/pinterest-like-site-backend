const { nanoid } = require('nanoid');
const { upload, client } = require('../middleware/connectionMW');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
module.exports = async function (pin) {
	try {
		const URL = pin.file.path || pin.URL;

		const uploadedImg = await upload({
			img: URL,
			id: `${nanoid()}`,
		});
		const publicURL = uploadedImg.url.replace(/http/, 'https');
		const tags = [];
		const tagsData = uploadedImg.info.detection.object_detection.data['cld-fashion'].tags;
		tags.push(...Object.keys(tagsData));

		await client
			.db()
			.collection('pins')
			.insertOne({
				img: publicURL,
				title: pin.title,
				description: pin.description || '',
				authorId: ObjectId(pin.authorId),
				keywords: tags,
			});
		const directory = path.resolve(__dirname, 'images');

		const files = fs.readdirSync(directory);
		files.forEach((file) => {
			fs.unlink(path.resolve(directory, file), (err) => {
				if (err) {
					console.error(err);
				}
			});
		});
		return tags;
	} catch (e) {
		console.error(e);
	}
};
