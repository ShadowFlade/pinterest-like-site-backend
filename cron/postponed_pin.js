const keys = require('../keys');
const axios = require('axios');
const logger = require('../utils/log');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const POSTPONED_PIN_PATH = keys.BASE_URL + '/postponedPin';
// do a request to rout to check if the server is up
async function run() {
	const res = await fetch(POSTPONED_PIN_PATH);
	console.log(res);
	const data = await res.json();
	console.log(data);
}
run();

// const data2 = axios({
// 	method: 'get',
// 	url: POSTPONED_PIN_PATH,
// 	responseType: 'json',
// }).then((res) => {
// 	logger.log('axios data' + '\n' + res);
// });
