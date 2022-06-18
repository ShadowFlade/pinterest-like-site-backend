const { nanoid } = require('nanoid');
const { upload, client } = require('../middleware/connectionMW');
const fs = require('fs');
const path = require('path');
module.exports = async function (pin) {
	const URL = pin.file.path || pin.URL;
	const uploadedImg = await upload({
		img: URL,
		id: `${nanoid()}`,
	});
	const publicURL = uploadedImg.url;
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
			authorId: pin.authorId,
			keywords: tags,
		});
	const directory = 'images';
	fs.readdir(directory, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join(directory, file), (err) => {
				if (err) throw err;
			});
		}
	});
	return tags;
};
