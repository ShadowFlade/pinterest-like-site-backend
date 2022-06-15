const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const { client, upload } = require('../middleware/connectionMW');
const { uploadFile } = require('../middleware/fileMW');
const auth = require('../middleware/authMW');
const ObjectId = require('mongodb').ObjectId;
const router = new Router();

router.post('/delete', async (req, res) => {
	const id = req.body._id;
	try {
		await client
			.db()
			.collection('pins')
			.deleteOne({ _id: ObjectId(id) });
		res.json({ success: 'Deleted item' });
	} catch (e) {
		console.error(e);
	}
});

router.get('/detailed/:id', auth, async (req, res) => {
	try {
		const pins = client.db().collection('pins');
		const users = client.db().collection('users');
		const pin = await pins.findOne({ _id: ObjectId(req.params.id) });
		let author;
		if (pin.authorId) {
			author = await users.findOne({ _id: ObjectId(pin.authorId) });
		}
		const response = { pin, author };
		res.json(response);
	} catch (e) {
		console.error(e);
	}
});

router.post('/upload', uploadFile.single('file'), async (req, res) => {
	const body = req.body;
	body.file = req.file;

	try {
		const URL = body.file.path || req.URL;
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
				title: body.title,
				description: body.description || '',
				authorId: req.body.authorId,
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
		res.json(tags);
	} catch (e) {
		console.error(e);
	}
});

router.post('/suggested', async (req, res) => {
	const keywords = req.body;
	const pins = client.db().collection('pins');
	const match = await pins.find({ keywords: { $in: [...keywords] } }).toArray();
	await res.json(match);
});

module.exports = router;
