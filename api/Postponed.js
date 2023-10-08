const { client } = require('../middleware/connectionMW');

class Postponed {
	constructor() {}
	//get pins which should be posted this minute
	ONE_DAY_IN_MILSECONDS = 60 * 60 * 24 * 1000;
	async getPins() {
		const pinsCollection = await client.db().collection('pins');
		const dayStart = Date.now();
		const dayEnd = this.ONE_DAY_IN_MILI_SECONDS + now;
		pinsCollection.find({ DATE_TO_PUBLISH: [{ $gte: dayStart }, { $lt: dayEnd }] });
	}
}
