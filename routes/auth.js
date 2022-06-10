const { Router } = require('express');
const multer = require('multer');
const multiPart = multer({});
const { client } = require('../middleware/connectionMW');
const bcrypt = require('bcryptjs');

const authRouter = new Router();
const users = client.db().collection('users');

authRouter.get('/', (req, res) => {
	try {
		if (req.session.isAuth) {
			const response = { isAuth: true, user: req.session.user };
			res.json(response);
		} else {
			res.json({ isAuth: false });
		}
	} catch (e) {
		console.error(e);
	}
});
authRouter.post('/login', multiPart.any(), async (req, res) => {
	const user = await users.findOne({ email: req.body.email, password: req.body.password });
	if (user) {
		req.session.user = user;
		req.session.isAuth = true;
		req.session.save((err) => {
			if (err) {
				throw err;
			}
			return res.json({ success: 'Success' });
		});
	} else {
		res.json({ error: 'No user was found with provided credentials' });
	}
});

authRouter.post('/register', multiPart.any(), async (req, res) => {
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
module.exports = authRouter;
