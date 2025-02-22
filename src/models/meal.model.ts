import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'Early Morning', 'Breakfast', 'Mid-Morning Snack', 'Lunch',
            'Afternoon Snack', 'Pre-Workout Meal', 'Post-Workout Meal', 'Dinner'
        ],
        required: true
    },
    name: { type: String, required: true },
    description: { type: String },
    nutritionalValues: {
        protein: { type: Number, required: true, default: 0 },
        carbs: { type: Number, required: true, default: 0 },
        fats: { type: Number, required: true, default: 0 },
        calories: { type: Number, required: true, default: 0 }
    }
});

const daySchema = new mongoose.Schema({
    day: { type: Number, required: true }, // Example: 1, 2, 3, 4, etc.
    meals: [mealSchema],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    totalCalories: { type: Number, required: true, default: 0 },
    totalProtein: { type: Number, required: true, default: 0 },
    totalCarbs: { type: Number, required: true, default: 0 },
    totalFats: { type: Number, required: true, default: 0 },
});

const mealPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    days: [daySchema],
}, { timestamps: true });

const MealPlan = mongoose.models.MealPlan || mongoose.model('MealPlan', mealPlanSchema);
export { MealPlan };
