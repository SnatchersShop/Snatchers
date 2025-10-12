import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase user ID
  email: { type: String, required: true, unique: true },
  name: String,
  photoURL: String,
});

const User = mongoose.model('User', UserSchema);

export default User;
