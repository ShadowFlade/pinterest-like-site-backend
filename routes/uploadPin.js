const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const { nanoid } = require('nanoid');
const { client, upload } = require('../middleware/connectionMW');
const { uploadFile } = require('../middleware/fileMW');
const getRandomKeywords = require('../data/keywords');

const uploadPinRouter = new Router();
uploadPinRouter.post('/', uploadFile.single('file'), async (req, res) => {
	const randomKeywords = getRandomKeywords(3);
	const body = req.body;
	body.file = req.file;

	try {
		const URL = body.file.path || req.URL;
		const uploadedImg = await upload({
			img: URL,
			id: `${nanoid()}`,
		});
		const publicURL = uploadedImg.url;

		await client
			.db()
			.collection('pins')
			.insertOne({
				img: publicURL,
				title: body.title,
				description: body.description || '',
				authorId: req.body.authorId,
				keywords: randomKeywords,
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
		res.json();
	} catch (e) {
		console.error(e);
	}
});
module.exports = uploadPinRouter;
