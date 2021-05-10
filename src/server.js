// Third party imports.
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Get values from environment.
dotenv.config();

// Handle uncaught exceptions. Happens synchronously!
process.on('uncaughtException', (err) => {
  console.log('Unhandled exception 💥! Application shutting down!');
  console.log(err.name, err.message);
  process.exit(1);
});

// Setup port.
const PORT = process.env.PORT || 3000;

// Setup server.
const app = require('./app');

// Setup NoSQL database.
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connection successfull! 🔥');
  })
  .catch((err) => {
    console.log('Error found with code:', err);
  });

// Listen to any of incoming requests.
const server = app.listen(PORT, () => {
  console.log(`Application running on Express.js on port ${PORT}! 👍`);
});

// Handle unhandled rejections --- the middleware stack will end here.
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection 💥! Application shutting down!');
  console.log(err.name, err.message);

  // Finish all requests that are still pending, the shutdown gracefully.
  server.close(() => {
    process.exit(1);
  });
});
