const { Router } = require('express');
const { rmSync } = require('fs');
const { client } = require('../middleware/connectionMW');
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

module.exports = router;
