// Module: routing for user registration
const express = require('express');
const { validateUser } = require('../validators/userValidator');
const store = require('../store/userStore');
const view = require('../views/render');

const router = express.Router();

// GET / -> show empty form
router.get('/', (req, res) => {
  res.status(200).send(view.formPage());
});

// POST /register -> validate on the server
router.post('/register', (req, res) => {
  const { valid, errors, data } = validateUser(req.body, store.getEmails());

  if (!valid) {
    // 400 Bad Request: re-render the form with error messages + old values
    return res.status(400).send(view.formPage(data, errors));
  }

  const user = store.addUser(data);
  res.status(201).send(view.successPage(user));
});

// GET /users -> list registered users
router.get('/users', (req, res) => {
  res.status(200).send(view.usersPage(store.getUsers()));
});

// GET /api/health -> JSON response example
router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', users: store.getUsers().length });
});

module.exports = router;
