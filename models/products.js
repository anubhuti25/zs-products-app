const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: { type: String, required: true},
  description: { type: String, required: true},
  imagePath: { type: String, required: true},
  price: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', productSchema);
