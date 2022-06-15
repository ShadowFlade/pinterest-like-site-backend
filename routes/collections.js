const { Router } = require('express');
const { client } = require('../middleware/connectionMW');
const { ObjectId } = require('mongodb');
const router = new Router();

router.post('/my', async (req, res) => {
	const collectionsCollection = await client.db().collection('collections');
	const collections = await collectionsCollection
		.find({ author: ObjectId(req.body.user._id) })
		.toArray();
	res.json(collections);
});

module.exports = router;
