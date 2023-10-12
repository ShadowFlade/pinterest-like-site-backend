const { client } = require('../middleware/connectionMW');
const { ObjectId } = require('mongodb');

class Postponed {
	constructor() {}
	//get pins which should be posted this minute
	ONE_DAY_IN_MILSECONDS = 60 * 60 * 24 * 1000;
	async init() {
		try {
			client.connect();
		} catch (e) {
			console.log('Could not connect to database ', e);
			throw new Error('error');
		}
		this.db = client.db('pinterest');

		const pins = await this.getPins();
		if (!pins) {
			return;
		}
		try {
			const updateResult = this.postPins(pins);
			return { success: true };
		} catch (e) {
			return { success: false, error: e };
		}
	}
	async getPins() {
		this.pinsCollection = await this.db.collection('pins');
		const dayStart = new Date().setHours(0, 0, 0, 0);
		const dayEnd = this.ONE_DAY_IN_MILSECONDS - 1 + dayStart;
		const pins = await this.pinsCollection
			.find({
				DATE_TO_PUBLISH: { $gt: dayStart, $lt: dayEnd },
			})
			.toArray();

		if (pins.length !== 0) {
			return pins;
		} else {
			process.exit();
		}
	}
	async postPins(pins) {
		const datePublished = Date.now();

		pins.forEach((pin) => {
			this.pinsCollection.updateOne(
				{ _id: pin._id },
				{ $set: { DATE_PUBLISHED: pin.DATE_TO_PUBLISH } }
			);
		});
	}
}

module.exports = Postponed;
