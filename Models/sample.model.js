const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  ts: {
    type: String,
    required: true,
  },
  machine_status: {
    type: Number,
    required: true,
  },
  vibration: {
    type: Number,
    required: true,
  },
});

const DataModel = mongoose.model('sample-table', dataSchema);

module.exports = DataModel;
