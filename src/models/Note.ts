import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  user: Types.ObjectId;
  title: string;
  noteContent: string;
  themeColor: string
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  noteContent:     { type: String, required: true },
  themeColor:      { type: String, required: true },
}, {
  collection: 'Notes',
  timestamps: true,
});

export const Note = model<INote>('Notes', NoteSchema);
