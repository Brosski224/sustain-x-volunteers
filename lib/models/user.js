import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  department: String,
  section: String,
  emailCount: {
    type: Number,
    default: 0,
  },
  ticketSold: Number,
  points: Number,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
