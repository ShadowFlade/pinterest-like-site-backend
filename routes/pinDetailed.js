const { Router } = require('express');
const { client } = require('../middleware/connectionMW');
const ObjectId = require('mongodb').ObjectId;
const auth = require('../middleware/authMW');
const pinDetailedRouter = new Router();

module.exports = pinDetailedRouter;
