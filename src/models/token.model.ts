import mongoose, { Model, Schema } from 'mongoose';

export interface IToken extends Document {
  token: string;
};

const TokenSchema = new Schema<IToken>(
  {
    token: { type: String, unique: true },
  },
  { timestamps: false },
);

const Token: Model<IToken> = mongoose.models.Token || mongoose.model<IToken>('Token', TokenSchema);

export default Token;
