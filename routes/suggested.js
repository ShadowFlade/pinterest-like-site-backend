const { Router } = require('express');
const suggestedRouter = new Router();
const { client } = require('../middleware/connectionMW');

suggestedRouter.post('/', async (req, res) => {
	const keywords = req.body;
	const pins = client.db().collection('pins');
	const response = keywords.map((item, index, arr) => {
		const match = pins.find({ keywords: { $in: [item] } });
		return match.filter((item) => !arr.includes(item));
	});
	res.json(response);
});

module.exports = suggestedRouter;
