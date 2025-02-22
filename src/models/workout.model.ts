import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    instructions: { type: String, required: true },
    description: { type: String },
    sets: { type: Number, required: true },
    reps: { type: Number },
    time: { type: String }, // Can store values like "30 sec" or "10 min"
    restTime: { type: String }, // Similar format as time
    image: { type: String }, // URL to exercise image
    equipment: { type: [String], default: [] }, // List of equipment needed
    muscleGroup: { type: [String], default: [] }, // Targeted muscle groups
});

const daySchema = new mongoose.Schema({
    day: { type: Number, required: true }, // Example: 1, 2, 3, 4 instead of Monday, Tuesday
    exercises: [exerciseSchema],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

const weekSchema = new mongoose.Schema({
    week: { type: Number, required: true }, // Example: 1, 2, 3, 4
    days: [daySchema],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

const workoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weeks: [weekSchema],
}, { timestamps: true });

weekSchema.pre('save', function (next) {
    if (this.days.every(day => day.status === 'completed')) {
        this.status = 'completed';
    } else {
        this.status = 'pending';
    }
    next();
});

const WorkoutPlan = mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', workoutPlanSchema);
export { WorkoutPlan };


