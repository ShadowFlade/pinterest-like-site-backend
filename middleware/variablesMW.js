module.exports = function (req, res, next) {
	res.locals.isAuth = req.session.isAuth; //TODO dont need it probably
	res.csrf = req.csrfToken();
	// const token = req.csrfToken();
	// res.cookie('XSRF-TOKEN', token);
	next();
};
