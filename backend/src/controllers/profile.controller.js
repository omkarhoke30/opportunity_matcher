import studentProfileModel from "../model/studentProfile.model.js";

// Only these fields can be written from the request body.
// (userId always comes from the token, never from the client.)
const ALLOWED_FIELDS = [
    "phone",
    "bio",
    "education",
    "branch",
    "skills",
    "interests",
    "projects",
    "preferredMode"
];

function pickProfileFields(body) {

    const data = {};

    for (const field of ALLOWED_FIELDS) {
        if (body[field] !== undefined) {
            data[field] = body[field];
        }
    }

    return data;
}


// POST /api/profile
async function createProfile(req, res) {

    try {

        const existingProfile = await studentProfileModel.findOne({
            userId: req.user.id
        });

        if (existingProfile) {
            return res.status(409).json({ message: "Profile already exists" });
        }

        const profile = await studentProfileModel.create({
            userId: req.user.id,
            ...pickProfileFields(req.body)
        });

        return res.status(201).json({
            message: "Profile created successfully",
            profile
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);

        return res.status(500).json({ message: "Failed to create profile" });
    }
}


// GET /api/profile
// If the student has no profile yet, an empty one is created,
// so the Profile page never has to handle a 404.
async function getMyProfile(req, res) {

    try {

        let profile = await studentProfileModel.findOne({
            userId: req.user.id
        });

        if (!profile) {
            profile = await studentProfileModel.create({
                userId: req.user.id
            });
        }

        return res.status(200).json({ profile });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to get profile" });
    }
}


// PUT /api/profile
async function updateMyProfile(req, res) {

    try {

        const profile = await studentProfileModel.findOneAndUpdate(
            { userId: req.user.id },
            { $set: pickProfileFields(req.body) },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            profile
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);

        return res.status(500).json({ message: "Failed to update profile" });
    }
}


export default {
    createProfile,
    getMyProfile,
    updateMyProfile
};
