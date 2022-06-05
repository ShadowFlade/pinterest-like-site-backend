const { Router } = require('express');
const { client } = require('../middleware/connectionMW');
const ObjectId = require('mongodb').ObjectId;
const pinDetailedRouter = new Router();

pinDetailedRouter.get('/detailed/:id', async (req, res) => {
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

module.exports = pinDetailedRouter;
