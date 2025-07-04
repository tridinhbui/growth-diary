import mongoose, { Document, Schema } from 'mongoose';

export interface IEntry extends Document {
  _id: string;
  userId: string;
  date: Date;
  moodScore: number; // 1-5 scale
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User',
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  moodScore: {
    type: Number,
    required: [true, 'Mood score is required'],
    min: [1, 'Mood score must be at least 1'],
    max: [5, 'Mood score must be at most 5'],
  },
  note: {
    type: String,
    required: [true, 'Note is required'],
    trim: true,
    maxlength: [1000, 'Note must be less than 1000 characters'],
  },
}, {
  timestamps: true,
});

// Create compound index for userId and date
EntrySchema.index({ userId: 1, date: -1 });

// Prevent re-compilation during development
const Entry = mongoose.models.Entry || mongoose.model<IEntry>('Entry', EntrySchema);

export default Entry; 