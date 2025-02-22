import mongoose from "mongoose";

const workoutPreferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: {
        type: String,
        enum: [
            'Weight Loss', 'Muscle Gain', 'Endurance',
            'General Fitness', 'Flexibility & Mobility', 'Event-Specific Training'
        ],
        required: true
    },
    eventName: { type: String, default: "" },
    bodyMetrics: {
        height: { type: Number, required: true }, // cm
        weight: { type: Number, required: true }, // kg
        bmi: { type: Number } // Optional, can be calculated
    },
    programDuration: { type: String, required: true }, // Weeks
    equipment: { type: [String], default: [] }, // List of selected equipment
    sessionLength: { type: Number, required: true }, // Minutes
    weeklyFrequency: { type: String, required: true },
    noRestDays: { type: Boolean, default: false },
    intensityLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    healthConsiderations: { type: [String], default: [] },
    additionalDetails: { type: String, default: '' }
}, { timestamps: true });

const WorkoutPreference = mongoose.models.WorkoutPreference || mongoose.model('WorkoutPreference', workoutPreferenceSchema);
export { WorkoutPreference };
