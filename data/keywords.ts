const keywords = [
    "dota",
    "dota2",
    "videogames",
    "twitch",
    "tech",
    "apple",
    "linux",
    "pc",
    "football",
    "sport",
    "basketball",
    "soccer",
    "nba",
    "TV",
    "apartments",
    "music",
    "band",
    "stream",
    "TV-show",
    "cinema",
    "movie",
];
//TODO this func is not complete, it may return duplicates
const getRandomKeywords = (numOfKeywords) => {
    const result = [];
    const random = function () {
        const randomIndex = Math.floor(Math.random() * keywords.length);
        const randomWord = keywords.splice(randomIndex, 1)[0];
        return randomWord;
    };
    for (let i = 0; i < numOfKeywords; i++) {
        let randomWord = random();
        while (keywords.includes(randomWord)) {
            randomWord = random();
        }
        result.push(randomWord);
    }
    return result;
};
module.exports = getRandomKeywords;
