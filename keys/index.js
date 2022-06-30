module.exports = {
	isSessionSecure: true ? process.env.NODE_ENV === 'production' : false,
};
