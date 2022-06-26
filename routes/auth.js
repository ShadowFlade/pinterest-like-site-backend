const { body, validationResult } = require('express-validator');
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
			const response = { isAuth: true, user: req.session.user, csrf: res.csrf };
			res.json(response);
		} else {
			res.json({ isAuth: false, csrf: res.csrf });
		}
	} catch (e) {
		console.error(e);
	}
});
authRouter.post('/login', multiPart.any(), async (req, res) => {
	const user = await users.findOne({ email: req.body.email });
	const areSame = await bcrypt.compare(req.body.password, user.password);
	if (user && areSame) {
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

authRouter.post('/register', body('email').isEmail(), multiPart.any(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.json({ error: errors.array()[0].msg });
		return res.status(422).redirect('/');
	}
	const users = client.db().collection('users');
	const { email, password } = req.body;
	const hashPassword = await bcrypt.hash(password, 10);

	const candidate = await users.findOne({ email });
	if (candidate) {
		res.json({ error: 'User with this email already exists' });
	} else {
		const user = { email, password: hashPassword };
		users.insertOne(user);
		res.json({ success: 'User was created' });
	}
});

authRouter.get('/logout', async (req, res) => {
	try {
		req.session.destroy();
		res.json({ success: 'logout successful' });
	} catch (e) {
		console.error(e);
	}
});
module.exports = authRouter;
