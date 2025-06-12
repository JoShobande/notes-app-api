// src/models/Note.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  _id:       Types.ObjectId;  // maps to Mongo’s _id
  title:     string;
  noteContent: string;
  themeColor: string;
  createdAt: Date;
  updatedAt: Date;
  userId:    Types.ObjectId;  // foreign key
  user?:     Types.ObjectId;  // populated ref to User
}

const NoteSchema = new Schema<INote>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    title: {
      type: String,
      required: true,
    },
    noteContent: {
      type: String,
      required: true,
    },
    themeColor: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,            // @@index([userId])
    },
  },
  {
    collection: 'notes',       // @@map("notes")
    timestamps: {
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt',  
    },
  }
);

// Export a model named “Notes” so that refs to 'Notes' work,
// or you can name it 'Note' if you prefer—just keep your ref strings in sync.
export const Notes = model<INote>('Notes', NoteSchema);
