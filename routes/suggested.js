const { Router } = require('express');
const suggestedRouter = new Router();
const { client } = require('../middleware/connectionMW');

suggestedRouter.post('/', async (req, res) => {
	const keywords = req.body;
	const pins = client.db().collection('pins');
	const match = await pins.find({ keywords: { $in: [...keywords] } }).toArray();
	await res.json(match);
});

module.exports = suggestedRouter;
