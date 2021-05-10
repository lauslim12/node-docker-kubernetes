/**
 * An easy way to capture operational errors without having to perform 'try-catch'.
 * Uses the concepts of closures.
 * The 'next' variable will direct all requests straight to 'middlewares/errorMiddleware'.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
