const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'key';
const COLLECTION_NAME = 'keys';

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
  user: {
    type: String,
    trim: true,
    ref: 'Shop'
  },
  publicKey: {
    type: String,
    unique: true,
  },
  refreshToken: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema)