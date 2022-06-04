const { Router } = require('express');
const multer = require('multer');
const { client } = require('../middleware/connectionMW');
const bcrypt = require('bcryptjs');

const multiPart = multer({});
const registerRouter = new Router();

registerRouter.post('/', multiPart.any(), async (req, res) => {
	const users = client.db().collection('users');
	const { email, password } = req.body;
	const candidate = await users.findOne({ email });
	if (candidate) {
		res.json({ error: 'User with this email already exists' });
	} else {
		const user = { email, password };
		users.insertOne(user);
		res.json({ success: 'User was created' });
	}
});
module.exports = registerRouter;
