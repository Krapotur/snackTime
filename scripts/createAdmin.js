require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDb } = require('../config/connectDb');
const  User  = require('../models/User');

async function main() {
  const login = process.argv[2];
  const password = process.argv[3];
  if (!login || !password) {
    // eslint-disable-next-line no-console
    console.log('Usage: node src/scripts/createAdmin.js <login> <password>');
    process.exit(1);
  }

  await connectDb();

  const normalizedLogin = String(login).toLowerCase().trim();
  const existing = await User.findOne({ login: normalizedLogin });
  if (existing) {
    existing.password = await bcrypt.hash(String(password), 10);
    await existing.save();
    // eslint-disable-next-line no-console
    console.log('Updated existing user to admin:', normalizedLogin);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  await User.create({ login: normalizedLogin, password: passwordHash, firstName: 'Администратор', lastName: 'System'});
  // eslint-disable-next-line no-console
  console.log('Created admin:', login);
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

