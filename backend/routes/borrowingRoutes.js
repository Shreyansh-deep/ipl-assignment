const express = require('express');
const routerBorrowing = express.Router();
const Borrowing = require('../models/borrowing');
const Book = require('../models/book');
const User = require('../models/user');

routerBorrowing.post('/', async (req, res) => {
  try {
    const book = await Book.findById(req.body.bookId);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
    if (!book.availability) {
      return res.status(400).send({ message: 'Book is not available for borrowing' });
    }
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const borrowing = new Borrowing({
      bookId: req.body.bookId,
      userId: req.body.userId,
      borrowDate: Date.now()
    });
    await borrowing.save();
    book.availability = false;
    await book.save();
    res.status(201).send({ message: 'Book borrowed successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error borrowing book' });
  }
});

routerBorrowing.put('/:id', async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    if (!borrowing) {
      return res.status(404).send({ message: 'Borrowing not found' });
    }
    borrowing.returnDate = Date.now();
    borrowing.status = 'returned';
    await borrowing.save();
    const book = await Book.findById(borrowing.bookId);
    book.availability = true;
    await book.save();
    res.status(200).send({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error returning book' });
  }
});

module.exports = routerBorrowing;