const { client } = require('../middleware/connectionMW');
const { ObjectId } = require('mongodb');

class Postponed {
	constructor() {}
	//get pins which should be posted this minute
	ONE_DAY_IN_MILSECONDS = 60 * 60 * 24 * 1000;
	ONE_MINUTE_IN_MILSECONDS = 60 * 1000;

	async init() {
		try {
			await client.connect();
		} catch (e) {
			console.log('Could not connect to database ', e);
			throw new Error('error');
		}
		this.db = client.db('pinterest');

		const pins = await this.getPins();

		if (!pins) {
			console.log('no pins');
			return;
		}
		try {
			const updateResult = await this.postPins(pins);
			console.log(updateResult, ' update result');
			return { success: true };
		} catch (e) {
			return { success: false, error: e };
		}
	}
	async getPins() {
		this.pinsCollection = await this.db.collection('pins');
		const dayStart = new Date().setSeconds(0, 0);
		const dayEnd = this.ONE_MINUTE_IN_MILSECONDS - 1 + dayStart;
		const pins = await this.pinsCollection
			.find({
				DATE_TO_PUBLISH: { $gt: dayStart, $lt: dayEnd },
			})
			.toArray();

		if (pins.length !== 0) {
			return pins;
		} else {
			return;
		}
	}
	async postPins(pins) {
		console.log(pins);
		for (const pin of pins) {
			const updateRes = await this.pinsCollection.updateOne(
				{ _id: pin._id },
				{ $set: { DATE_PUBLISHED: Date.now() } }
			);
		}
	}
}

module.exports = Postponed;
