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
