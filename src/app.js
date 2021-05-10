// Third-party imports.
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

// Routers.
const userRouter = require('./routes/userRoutes');

// Middlewares.
const errorMiddleware = require('./middlewares/errorMiddleware');

// Utilities.
const AppError = require('./utils/AppError');

// Setup our application.
const app = express();

// Setup our middlewares.
// Security headers.
app.use(helmet());

// Body parser.
app.use(express.json({ limit: '1kb' }));
app.use(cookieParser());

// Sanitize inputs (NoSQL query attacks).
app.use(mongoSanitize());

// Sanitize inputs.
app.use(xss());

// Prevent parameter pollution.
app.use(hpp());

// Development logs.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compress responses.
app.use(compression());

// Create limiters.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests! Please try again later!',
});

// Non-essential route starts here.
const connectionTest = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Connected successfully! 🚀',
  });
};

const preventRobots = (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
};

app.route('/').get(connectionTest);
app.route('/robots.txt').get(preventRobots);

// Essential routes starts here.
app.use('/api', limiter);
app.use('/api/v1/users', userRouter);

// Setup not-found error.
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Setup global error handling middleware.
app.use(errorMiddleware);

module.exports = app;
