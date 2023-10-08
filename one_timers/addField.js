require('dotenv').config();
const { client } = require('../middleware/connectionMW');

async function run() {
	const FIELD = 'DATE_INSERT';
	await client.connect();
	const pins = await client.db('pinterest').collection('pins');
	const pin = await pins.findOne({});
	if (!pin.hasOwnProperty(FIELD)) {
		process.exit();
	}
	const updateResult = pins.updateMany(
		{},
		{ $set: { [FIELD]: null } },
		{ upsert: false, multi: true }
	);
	return updateResult;
}
run();
