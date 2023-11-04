const kebabToCamelCase = (str) => {
	return str.replace(/-([a-z])/g, function (match, letter) {
	  return letter.toUpperCase();
	});
  }
  

const parseCLIArgs = (argsv) => {
    const argsList = argsv.slice(2);
	const args = {};
	argsList.forEach((arg) => {
		const argSplit = arg.split('=');
        const key = kebabToCamelCase(argSplit[0].slice(2));
		args[key] = argSplit[1];
	});
	if (Object.keys(args).length > 0) {
		return args;
	} else {
		return false;
	}
};


module.exports = {
	parseCLIArgs,
    kebabToCamelCase
};