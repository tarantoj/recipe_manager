/* eslint-disable no-console */
const mongoose = require('mongoose');

const { MONGODB_HOST, MONGODB_USER, MONGODB_PASS } = process.env;

const dbURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}`;

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
