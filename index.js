require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { homeRouter } = require('./routes/home.js');
const uploadPinRouter = require('./routes/uploadPin');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const varMiddleware = require('./middleware/variablesMW');
const pinDetailedRouter = require('./routes/pinDetailed.js');
const MongoStore = require('connect-mongodb-session')(session);

const app = express();

const store = new MongoStore({
	collection: 'sessions',
	uri: process.env.SECRET_URI,
});
app.use(
	cors({
		origin: 'http://localhost',
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
	res.header('Content-Type', 'application/json;charset=UTF-8');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
const ONE_DAY = 1000 * 60 * 60 * 24;
app.use(
	session({
		secret: 'some secret value',
		resave: false,
		saveUninitialized: true,
		store,
		cookie: { maxAge: ONE_DAY },
	})
);
app.use(cookieParser());
app.use(varMiddleware);

const start = async () => {
	try {
		app.listen(3002, () => {});
	} catch (e) {
		console.error(e);
	}
};
start().then(() => {
	console.log('success');
});

app.use('/', homeRouter);
app.use('/pinupload', uploadPinRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/pin', pinDetailedRouter);
