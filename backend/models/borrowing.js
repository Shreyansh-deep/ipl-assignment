const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' }
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

module.exports = Borrowing;