const { nanoid } = require('nanoid');
const { upload, client } = require('../middleware/connectionMW');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
module.exports = async function (pin) {
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
	const directory = 'images';
	try {
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		}
		fs.readdir(directory, (err, files) => {
			if (err) throw err;

			for (const file of files) {
				fs.unlink(path.join(directory, file), (err) => {
					if (err) throw err;
				});
			}
		});
	} catch (e) {
		console.log(e);
	}

	return tags;
};
