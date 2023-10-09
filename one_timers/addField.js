require('dotenv').config();
const { client } = require('../middleware/connectionMW');

async function run() {
	let FIELD = 'DATE_TO_PUBLISH';
	if (process.argv.length > 2) {
		FIELD = process.argv[2]; //currently does not support FIELD=VALUE
	}
	await client.connect();
	const pins = await client.db('pinterest').collection('pins');
	const pin = await pins.findOne({});
	if (pin.hasOwnProperty(FIELD)) {
		process.exit();
	}
	const updateResult = await pins.updateMany(
		{},
		{ $set: { [FIELD]: null } },
		{ upsert: false, multi: true }
	);
	console.log(updateResult, ' update result');
	process.exit();
}
run();
