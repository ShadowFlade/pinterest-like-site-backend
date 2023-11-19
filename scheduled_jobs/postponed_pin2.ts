require('dotenv').config();
const keys = require('../keys');
const axios = require('axios');
const logger = require('../utils/log');
const Postponed = require('../api/Postponed');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const POSTPONED_PIN_PATH = keys.BASE_URL + '/postponedPin';
// let i = 0;
const ONE_MINUTE = 1000 * 60;
async function run() {
	// i += 1;
	try {
		const res = await fetch(POSTPONED_PIN_PATH);
		await res.json();
		console.log('server is up');
		const postponed = new Postponed();
		await postponed.init();
		console.log('job finished ', new Date().toString());
	} catch (e) {
		console.log('server is daun');
		process.exit();
	}
}

setInterval(run, 1000);
