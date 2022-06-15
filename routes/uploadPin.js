const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const { nanoid } = require('nanoid');
const { client, upload } = require('../middleware/connectionMW');
const getRandomKeywords = require('../data/keywords');

const uploadPinRouter = new Router();
module.exports = uploadPinRouter;
