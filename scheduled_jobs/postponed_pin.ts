//docs available in /docs/cron/postponed_pin
require('dotenv').config();
const keys = require('../keys');
const axios = require('axios');
const logger = require('../utils/log');
const Postponed = require('../api/Postponed');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const POSTPONED_PIN_PATH = keys.BASE_URL + '/postponedPin';
// do a request to rout to check if the server is up
async function run() {
	try {
		const res = await fetch(POSTPONED_PIN_PATH);
		await res.json();
		console.log('server is up');
		const postponed = new Postponed();
		await postponed.init();
		console.log('job finished ', new Date().toString());
		process.exit();
	} catch (e) {
		console.log('server is daun');
		process.exit();
	}
}
run();
