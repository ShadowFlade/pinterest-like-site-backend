const { Router } = require('express');
const { nanoid } = require('nanoid');
const { client, upload } = require('../middleware/connectionMW');
const homeRouter = Router();
homeRouter.get('/pins/:numberOfPins', async (req, res) => {
	const collection = await client.db('pinterest').collection('pins');
	console.log(collection, ' collection');
	try {
		const pinterest = collection
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
			])
			.limit(Number(req.params.numberOfPins));
		if ((await collection.estimatedDocumentCount()) === 0) {
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
