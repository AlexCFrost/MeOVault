import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    minlength: [1, 'Note content cannot be empty']
  }
}, {
  timestamps: true
});

export const Note = mongoose.model<INote>('Note', noteSchema);
