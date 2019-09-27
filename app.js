const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);

// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

require('./models/db');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const recipeRouter = require('./routes/recipe');

const sessionConfig = {
  secret: process.env.SESSION_SECRET, // change soon
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
  resave: true,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'applicationSessions',
  }),
};


const app = express();

app.use(session(sessionConfig));

const oauth2 = require('./lib/oauth2');

app.use(passport.initialize());
app.use(passport.session());
app.use(oauth2.router);
app.use(oauth2.template);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('super-secret')); // change secret
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/recipe', recipeRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
