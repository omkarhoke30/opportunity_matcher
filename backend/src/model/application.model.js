import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
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

    status: {
        type: String,
        enum: ["applied", "shortlisted", "accepted", "rejected"],
        default: "applied"
    },

    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// one application per student per opportunity
applicationSchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

const applicationModel = mongoose.model("Application", applicationSchema);

export default applicationModel;
