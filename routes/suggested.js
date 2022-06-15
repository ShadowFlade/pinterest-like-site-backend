const { Router } = require('express');
const suggestedRouter = new Router();
const { client } = require('../middleware/connectionMW');

module.exports = suggestedRouter;
