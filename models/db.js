/* eslint-disable no-console */
const mongoose = require('mongoose');

const ATLAS_USER = process.env.ATLAS_USER || '';
const ATLAS_PASS = process.env.ATLAS_PASS || '';
const dbURI = `mongodb+srv://${ATLAS_USER}:${ATLAS_PASS}@cluster0-grx4h.mongodb.net/test?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  dbName: 'test',
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
