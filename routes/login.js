const { Router } = require('express');
const multer = require('multer');
const multiPart = multer({});
const { client } = require('../middleware/connectionMW');
const bcrypt = require('bcryptjs');
const loginRouter = new Router();
const users = client.db().collection('users');

loginRouter.get('/auth', (req, res) => {
  try {
    if (req.session.isAuth) {
      res.json({ isAuth: true });
    } else {
      res.json({ isAuth: false });
    }
  } catch (e) {
    console.log(e);
  }
});
loginRouter.post('/', multiPart.any(), async (req, res) => {
  const user = await users.findOne({ email: req.body.email, password: req.body.password });
  console.log(req.session);
  if (user) {
    req.session.user = user;
    req.session.isAuth = true;
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.json({ success: 'Success' });
    });
  } else {
    res.json({ error: 'No user was found with provided credentials' });
  }
});

module.exports = loginRouter;
