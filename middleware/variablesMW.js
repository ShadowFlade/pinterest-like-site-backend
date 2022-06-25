module.exports = function (req, res, next) {
	res.locals.isAuth = req.session.isAuth; //TODO dont need it probably
	res.csrf = req.csrfToken();
	next();
};
