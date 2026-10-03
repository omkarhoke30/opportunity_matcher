import mongoose from "mongoose";

const savedOpportunitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    opportunityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        required: true
    },

    savedAt: {
        type: Date,
        default: Date.now
    }
});

// a student can save an opportunity only once
savedOpportunitySchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

const savedOpportunityModel = mongoose.model(
    "SavedOpportunity",
    savedOpportunitySchema
);

export default savedOpportunityModel;
