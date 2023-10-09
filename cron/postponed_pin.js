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
		const updateResult = postponed.init();
	} catch (e) {
		console.log('server is daun');
		process.exit();
	}
}
run();

// const data2 = axios({
// 	method: 'get',
// 	url: POSTPONED_PIN_PATH,
// 	responseType: 'json',
// }).then((res) => {
// 	logger.log('axios data' + '\n' + res);
// });
