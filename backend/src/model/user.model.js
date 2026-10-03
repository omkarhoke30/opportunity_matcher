import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // select:false → never returned by queries unless you ask for it
        // (login uses .select("+passwordHash"))
        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;