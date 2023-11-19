module.exports = {
	isSessionSecure: true ? process.env.NODE_ENV === 'production' : false,
	BASE_URL: 'http://localhost:3002',
	filePaths: {
		SCHEDULED_JOBS: 'scheduled_jobs/',
	},
};
