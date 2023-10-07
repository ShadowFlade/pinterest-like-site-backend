const { Router } = require('express');
const router = Router();
router.get('/', async (req, res) => {
	try {
		console.log('loading...');
		console.log(req);
		return res.json({ success: true });
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
