import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

const imageSchema  = new Schema({
    name: { type: String, required: true },
    url: { type: String, require: true }
}, { timestamps: true })

const Image = models.Image || mongoose.model('Image', imageSchema);
export { Image }