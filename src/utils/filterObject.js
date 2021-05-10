/**
 * Filter function to remove any unwanted key-value pairs in an object.
 * Reference: https://stackoverflow.com/a/66639897/13980107 (my answer on StackOverflow).
 */
const filterObject = (obj, ...allowedFields) => {
  const newObject = {};

  // If the current field is not one of the allowed fields, keep them in the new object.
  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });

  return newObject;
};

module.exports = filterObject;
