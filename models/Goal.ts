import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: 'mood' | 'streak' | 'frequency' | 'personal';
  targetValue: number;
  currentValue: number;
  unit: string; // 'days', 'entries', 'points', etc.
  targetDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be less than 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['mood', 'streak', 'frequency', 'personal'],
  },
  targetValue: {
    type: Number,
    required: [true, 'Target value is required'],
    min: [1, 'Target value must be at least 1'],
  },
  currentValue: {
    type: Number,
    default: 0,
    min: [0, 'Current value cannot be negative'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: String,
    default: 'medium',
    enum: ['low', 'medium', 'high'],
  },
}, {
  timestamps: true,
});

// Index for performance
GoalSchema.index({ userId: 1, isActive: 1 });
GoalSchema.index({ userId: 1, category: 1 });

// Virtual for progress percentage
GoalSchema.virtual('progressPercentage').get(function() {
  if (this.targetValue === 0) return 0;
  return Math.min((this.currentValue / this.targetValue) * 100, 100);
});

// Virtual for days remaining
GoalSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const targetDate = new Date(this.targetDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
});

// Method to mark goal as completed
GoalSchema.methods.markCompleted = function() {
  this.isCompleted = true;
  this.completedAt = new Date();
  this.currentValue = this.targetValue;
  return this.save();
};

// Method to update progress
GoalSchema.methods.updateProgress = function(newValue: number) {
  this.currentValue = Math.min(newValue, this.targetValue);
  
  // Auto-complete if target reached
  if (this.currentValue >= this.targetValue && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Prevent re-compilation during development
const Goal = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal; 