const { Router } = require('express');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/authMW');
const { client } = require('../middleware/connectionMW');
const profileRouter = new Router();

profileRouter.get('/:id', async (req, res) => {
	// const token = req.csrfToken();
	// res.cookie('XSRF-TOKEN', token);
	try {
		const user = await client
			.db()
			.collection('users')
			.findOne({ _id: ObjectId(req.params.id) });
		console.log(user);
		res.json({ email: user.email });
	} catch (reason) {
		res.json({ error: 'No user user with that id' });
		console.error(reason);
	}
});
profileRouter.get('/me', auth, (req, res) => {
	console.log('profile me route');
});

module.exports = profileRouter;
