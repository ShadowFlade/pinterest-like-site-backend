const { Router } = require('express');
const { client } = require('../middleware/connectionMW');
const ObjectId = require('mongodb').ObjectId;
const pinDetailedRouter = new Router();

pinDetailedRouter.get('/detailed/:id', async (req, res) => {
	try {
		const pins = client.db().collection('pins');
		const users = client.db().collection('users');
		console.log(req.params);
		const pin = await pins.findOne({ _id: ObjectId(req.params.id) });
		console.log(pin, 'PIN');
		let author;
		if (pin.author) {
			author = await users.findOne({ $or: [{ name: pin.author }, { email: pin.author }] });
		}
		const response = { pin, author };
		console.log(response);
		res.json(response);
	} catch (e) {
		console.log(e);
	}
});

module.exports = pinDetailedRouter;
