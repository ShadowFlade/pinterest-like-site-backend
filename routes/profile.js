const { Router } = require('express');
const auth = require('../middleware/authMW');

const profileRouter = new Router();

profileRouter.get('/me', auth, (req, res) => {});

module.exports = profileRouter;
