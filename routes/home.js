const { Router } = require('express');
const { nanoid } = require('nanoid');
const { client, upload } = require('../middleware/connection');
const homeRouter = Router();
homeRouter.get('/', async (req, res) => {
  const pinterest = client.db().collection('pins').find();

  if ((await client.db().collection('pins').estimatedDocumentCount()) === 0) {
    console.error('No documents found!');
  }
  const items = [];
  await pinterest.forEach((item) => {
    const newItem = JSON.parse(JSON.stringify(item));
    items.push(newItem);
  });
  res.json({ pinterest: items });
});

module.exports = {
  homeRouter,
};
