require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const cookieParser = require('cookie-parser');
const { homeRouter } = require('./routes/home.js');
const authRouter = require('./routes/auth');
const varMiddleware = require('./middleware/variablesMW');
const pinRouter = require('./routes/pin');
const profileRouter = require('./routes/profile');
const MongoStore = require('connect-mongodb-session')(session);

const app = express();
const allowedOrigins = ['http://localhost', 'http://res.cloudinary.com'];

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
app.use(
	session({
		secret: 'some secret value',
		resave: false,
		saveUninitialized: false,
		store,
		cookie: { maxAge: ONE_DAY },
	})
);
app.use(cookieParser('some secret value'));
app.use(varMiddleware);

const start = async () => {
	try {
		app.listen(3002, () => {});
	} catch (e) {
		console.error(e);
	}
};
start().then(() => {
	console.error('success');
});

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/pin', pinRouter);
