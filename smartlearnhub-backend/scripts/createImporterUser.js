/* eslint-disable no-undef */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js'; // adjust path if your models folder differs

dotenv.config();

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('Please set MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let user = await User.findOne({ email: 'importer@local' });
  if (user) {
    console.log('Importer user already exists:');
    console.log({ id: user._id.toString(), email: user.email, name: user.name });
    await mongoose.disconnect();
    process.exit(0);
  }

  const randomPassword = Math.random().toString(36).slice(2, 12); // random password
  user = new User({
    name: 'Importer',
    email: 'importer@local',
    password: randomPassword,
    role: 'system'
  });

  await user.save();

  console.log('Created importer user:');
  console.log({ id: user._id.toString(), email: user.email, password: randomPassword });
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
