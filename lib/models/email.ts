import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  section: { type: String, required: true },
  password: { type: String, required: true },
  referralCode: { type: String, required: true }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);