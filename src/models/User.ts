import { Schema, model, Document, Types } from 'mongoose';


export interface IUser extends Document {
  _id: Types.ObjectId;        // maps to Mongo’s _id
  firstName: string;
  lastName: string;
  email?: string;
  emailVerified?: Date;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: Types.ObjectId[];
  accounts: Types.ObjectId[]; 
  notes: Types.ObjectId[];    
}

const UserSchema = new Schema<IUser>(
  {
    // NOTE: Mongoose automatically defines _id: ObjectId for you,
    // but you can be explicit if you like:
    _id: { type: Schema.Types.ObjectId, auto: true },

    firstName:      { type: String, required: true },
    lastName:       { type: String, required: true },

    email:          { type: String, unique: true, sparse: true },
    emailVerified:  { type: Date,   default: null },
    hashedPassword: { type: String, default: null },

    // these arrays assume you have Session, Account, and Notes models:
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    notes:    [{ type: Schema.Types.ObjectId, ref: 'Notes' }],
  },
  {
    collection: 'User',                  // match your existing collection name
    timestamps: {                        // auto-manage createdAt & updatedAt
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
  },
});

export const User = model<IUser>('User', UserSchema);
