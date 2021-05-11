// Node imports
const fs = require('fs');

// Third-party imports
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Models
const User = require('../src/models/userModel');

// Configurations
dotenv.config({ path: `${__dirname}/../.env` });

// Database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successfull!');
  })
  .catch((err) => {
    console.log('Error with code: ', err);
  });

// Read JSON
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Import the data to the database
const importDevData = async () => {
  try {
    await User.create(users);

    console.log('Data has been successfully inserted!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

// Delete the data if it ever gets dirty
const deleteDevData = async () => {
  try {
    await User.deleteMany();

    console.log('Data has been successfully deleted!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--import') {
  importDevData();
} else if (process.argv[2] === '--delete') {
  deleteDevData();
} else {
  console.log(
    'Please pass the --import or --delete arguments (e.g. node migrate --import) to use this program.'
  );
}
