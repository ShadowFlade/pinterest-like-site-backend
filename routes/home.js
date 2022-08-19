const { Router } = require('express');
const { nanoid } = require('nanoid');
const { client, upload } = require('../middleware/connectionMW');
const homeRouter = Router();
homeRouter.get('/', async (req, res) => {
	try {
		const pinterest = client
			.db()
			.collection('pins')
			.aggregate([
				{
					$match: {},
				},
				{
					$lookup: {
						localField: 'authorId',
						from: 'users',
						foreignField: '_id',
						as: 'user',
					},
				},
				{ $unwind: '$user' },
			]);

		if ((await client.db().collection('pins').estimatedDocumentCount()) === 0) {
			console.error('No documents found!');
		}
		
		const items = [];
		await pinterest.forEach((item) => {
			const newItem = JSON.parse(JSON.stringify(item));
			delete newItem.user.password;
			items.push(newItem);
		});

		res.json({ pinterest: items });
	} catch (e) {
		console.error(e);
	}
});

module.exports = {
	homeRouter,
};
