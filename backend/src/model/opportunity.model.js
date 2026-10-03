import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "internship",
                "hackathon",
                "competition",
                "workshop",
                "event",
                "project",
                "scholarship",
                "job",
                "other"
            ],
            required: true
        },

        organization: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            default: "Not specified"
        },

        // used later to match against studentProfile.preferredMode
        mode: {
            type: String,
            enum: ["online", "offline", "hybrid"],
            default: "online"
        },

        startDate: {
            type: Date
        },

        deadline: {
            type: Date
        },

        eligibility: {
            type: String
        },

        skills: {
            type: [String],
            default: []
        },

        registrationLink: {
            type: String
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const opportunityModel = mongoose.model("Opportunity", opportunitySchema);

export default opportunityModel;