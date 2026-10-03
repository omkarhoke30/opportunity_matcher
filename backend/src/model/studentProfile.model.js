import mongoose from "mongoose";

// Name and email live on the User document (GET /api/auth/me),
// so they are not duplicated here.
const studentProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        education: {
            type: String,
            trim: true,
            default: ""
        },

        branch: {
            type: String,
            trim: true,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        interests: {
            type: [String],
            default: []
        },

        projects: {
            type: [String],
            default: []
        },

        preferredMode: {
            type: String,
            enum: ["any", "online", "offline", "hybrid"],
            default: "any"
        }
    },
    {
        timestamps: true
    }
);

const studentProfileModel = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);

export default studentProfileModel;