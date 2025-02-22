import mongoose, { Schema, models, model, Document } from 'mongoose';

interface IMealPreference extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    dietaryRestrictions: string[];
    allergies: string;
    availableIngredients: string[];
    caloricIntakeGoal: number;
    mealCountPreference: '3 Meals' | '5 Meals' | '6+ Meals';
    foodPreferences: string[];
    goal: string;
    bmi: number;
    height: number;
    weight: number;
}

const mealPreferenceSchema = new Schema<IMealPreference>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        dietaryRestrictions: {
            type: [String],
            enum: ['Vegetarian', 'Vegan', 'Gluten-free', 'Lactose-free', 'Halal', 'Jain', 'Kosher', 'None'],
            default: [],
        },
        goal: {
            type: String,
            required: true,
        },
        allergies: { type: String, default: "" }, // Stores user's allergies
        mealCountPreference: {
            type: String,
            enum: ['3 Meals', '5 Meals', '6+ Meals'],
            required: true,
        },
        bmi: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const MealPreference = models.MealPreference || model<IMealPreference>('MealPreference', mealPreferenceSchema);

export { MealPreference };

