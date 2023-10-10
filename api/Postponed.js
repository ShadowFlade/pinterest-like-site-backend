const { client } = require('../middleware/connectionMW');

class Postponed {
	constructor() {}
	//get pins which should be posted this minute
	ONE_DAY_IN_MILSECONDS = 60 * 60 * 24 * 1000;
	async init() {
		console.log('init');
		try {
			client.connect();
		} catch (e) {
			console.log('Could not connect to database ', e);
			throw new Error('error');
		}
		console.log('1');
		this.db = client.db('pinterest');

		const pins = await this.getPins();
		if (!pins) {
			return;
		}
		console.log('3');
		try {
			const updateResult = this.postPins(pins);
			console.log('4');
			console.log(updateResult, ' updateresult');
			return { success: true };
		} catch (e) {
			return { success: false, error: e };
		}
	}
	async getPins() {
		this.pinsCollection = await this.db.collection('pins');
		const dayStart = new Date().setHours(0, 0, 0, 0);
		const dayEnd = this.ONE_DAY_IN_MILSECONDS - 1 + dayStart;
		console.log({
			dayStart,
			dayEnd,
			now: Date.now(),
			is: dayEnd > dayStart,
		});
		const pins = await this.pinsCollection
			.find({
				DATE_TO_PUBLISH: { $gt: dayStart, $lt: dayEnd },
			})
			.toArray();

		console.log('2');
		if (pins.length !== 0) {
			return pins;
		} else {
			process.exit();
		}
	}
	async postPins(pins) {
		const datePublished = Date.now();
		pins.forEach((item) => (item.DATE_PUBLISHED = datePublished));
		this.pinsCollection.insertMany(pins);
	}
}

module.exports = Postponed;
