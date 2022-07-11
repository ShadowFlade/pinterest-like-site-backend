const fs = require('fs');
const path = require('path');
require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const cookieParser = require('cookie-parser');
const { homeRouter } = require('./routes/home.js');
const authRouter = require('./routes/auth');
const varMiddleware = require('./middleware/variablesMW');
const pinRouter = require('./routes/pin');
const profileRouter = require('./routes/profile');
const collectionRouter = require('./routes/collections');
const MongoStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const errorHandler = require('./middleware/error');
const keys = require('./keys');
const app = express();
const allowedOrigins = [
	'http://localhost',
	'https://res.cloudinary.com',
	'https://floating-earth-90111.herokuapp.com',
	'https://shadowflade.github.io',
];

const store = new MongoStore({
	collection: 'sessions',
	uri: process.env.SECRET_URI,
});
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
	res.header('Content-Type', 'application/json;charset=UTF-8');
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
const ONE_DAY = 1000 * 60 * 60 * 24;
app.set('trust proxy', 1);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store,
		cookie: { maxAge: ONE_DAY, secure: keys.isSessionSecure },
	})
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(csurf({ cookie: true }));
app.use(helmet());
app.use(varMiddleware);
// app.use(function (req, res, next) {
// 	if (req.session.user) {
// 		varMiddleware();
// 	}
// 	next();
// });
app.use(compression());

const devPort = process.env.NODE_ENV === 'development' ? 3000 : 3002;
const port = process.env.PORT || devPort;
const start = async () => {
	try {
		app.listen(port, () => {});
	} catch (e) {
		console.error(e);
	}
};
start().then(() => {
	console.error('success on port', port);
});

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/pin', pinRouter);
app.use('/collections', collectionRouter);
app.use(errorHandler);
