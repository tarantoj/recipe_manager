/* eslint-disable no-console */
const mongoose = require('mongoose');

const { MONGODB_URI } = process.env;

const dbURI = MONGODB_URI;

const options = {
  useNewUrlParser: true,
  dbName: 'recipeman',
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log('Database connection established!');
  },
  (err) => {
    console.log('Error connecting Database instance due to: ', err);
  },
);

require('./recipe');
