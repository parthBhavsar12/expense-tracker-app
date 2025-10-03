import mongoose, { Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
  },
  { timestamps: false },
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
