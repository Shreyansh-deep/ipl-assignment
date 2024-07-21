const express = require('express');
const routerBook = express.Router();
const Book = require('../models/book');

routerBook.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching books' });
  }
});

routerBook.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send({ message: 'Book created successfully' });
  } catch (err) {
    res.status(400).send({ message: 'Error creating book' });
  }
});

routerBook.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching book'})
  }
})

module.exports = routerBook;