const { Router } = require('express');
const router = Router();
router.get('/', async (req, res) => {
	try {
		return res.json({ success: true });
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
