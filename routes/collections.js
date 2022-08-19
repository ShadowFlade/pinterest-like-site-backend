const { Router } = require('express');
const { client } = require('../middleware/connectionMW');
const { ObjectId } = require('mongodb');
const router = new Router();

router.post('/my', async (req, res) => {
	const collectionsCollection = await client.db().collection('collections');
	const collections = await collectionsCollection
		.find({ author: ObjectId(req.body._id) })
		.toArray();
	res.json(collections);
});

router.get('/user/:id',async(req,res)=>{
	const collectionDB = await client.db().collection('collections');
	const collecitons = await collectionDB.find({author:req.params.id}).toArray();
	return res.json(collecitons);
})

module.exports = router;
 