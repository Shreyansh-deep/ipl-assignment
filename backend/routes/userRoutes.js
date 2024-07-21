const express = require('express');
const routerUser = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

routerUser.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).send({ message: 'Error creating user' });
  }
});

routerUser.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const isValid = await user.comparePassword(req.body.password);
    if (!isValid) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send({ message: 'Error logging in' });
  }
});

module.exports = routerUser;