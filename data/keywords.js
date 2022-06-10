const keywords = [
	'dota',
	'dota2',
	'videogames',
	'twitch',
	'tech',
	'apple',
	'linux',
	'pc',
	'football',
	'sport',
	'basketball',
	'soccer',
	'nba',
	'TV',
	'apartments',
	'music',
	'band',
	'stream',
	'TV-show',
	'cinema',
	'movie',
];
const getRandomKeywords = (numOfKeywords) => {
	const result = [];
	for (let i = 0; i < numOfKeywords; i++) {
		const randomIndex = Math.floor(Math.random() * keywords.length);
		const randomWord = keywords.splice(randomIndex, 1)[0];
		result.push(randomWord);
	}
	return result;
};
module.exports = getRandomKeywords;
