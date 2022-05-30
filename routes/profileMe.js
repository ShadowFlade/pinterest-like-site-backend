const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const { nanoid } = require('nanoid');
const profileMeRouter = new Router();
profileMeRouter.get('/profile/me', () => {});
