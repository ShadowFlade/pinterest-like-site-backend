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
		this.db = client.db();

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
		const dayStart = this.getStartOfDay();
		const dayEnd = this.ONE_DAY_IN_MILI_SECONDS + dayStart;
		const pins = await this.pinsCollection
			.find({
				DATE_TO_PUBLISH: [{ $gte: dayStart }, { $lt: dayEnd }],
			})
			.toArray();

		console.log('2');
		console.log(pins, ' pins');
		if (pins.length !== 0) {
			return pins;
		} else {
			return false;
		}
	}
	async postPins(pins) {
		const datePublished = Date.now();
		pins.forEach((item) => (item.DATE_PUBLISHED = datePublished));
		this.pinsCollection.insertMany(pins);
	}

	getStartOfDay(currTime) {}
}

module.exports = Postponed;
