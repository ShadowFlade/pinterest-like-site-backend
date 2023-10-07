const fs = require('node:fs');

class Logger {
	static log(content, isRewrite = false) {
		const flag = isRewrite ? 'w' : 'a+';
		const data = new Date(Date.now()) + '\n' + JSON.stringify(content);
		fs.writeFile('./log.log', data, { flag }, (err) => {
			if (err) throw err;
			// console.error(err, ' error');
		});
	}
}
module.exports = Logger;
