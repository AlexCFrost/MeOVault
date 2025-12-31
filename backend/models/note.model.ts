import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  content: string;
  embedding: number[];
  embeddingModel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    minlength: [1, 'Note content cannot be empty']
  },
  embedding: {
    type: [Number],
    required: [true, 'Embedding vector is required'],
    validate: {
      validator: function(v: number[]) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Embedding must be a non-empty array of numbers'
    }
  },
  embeddingModel: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const Note = mongoose.model<INote>('Note', noteSchema);
