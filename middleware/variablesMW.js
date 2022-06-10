module.exports = function (req, res, next) {
	res.locals.isAuth = req.session.isAuth; //TODO dont need it probably
	next();
};
