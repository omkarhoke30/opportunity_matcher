import mongoose from "mongoose";
import opportunityModel from "../model/opportunity.model.js";
import applicationModel from "../model/application.model.js";
import savedOpportunityModel from "../model/savedOpportunity.model.js";

// Only these fields can be written from the request body
const ALLOWED_FIELDS = [
    "title",
    "description",
    "type",
    "organization",
    "location",
    "mode",
    "startDate",
    "deadline",
    "eligibility",
    "skills",
    "registrationLink"
];

function pickFields(body) {

    const data = {};

    for (const field of ALLOWED_FIELDS) {
        if (body[field] !== undefined) {
            data[field] = body[field];
        }
    }

    // allow "react, node" as well as ["react", "node"]
    if (typeof data.skills === "string") {
        data.skills = data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    return data;
}

// so a search like "c++" is treated as text, not as a regex
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}


// CREATE OPPORTUNITY (admin)
async function createOpportunity(req, res) {

    try {

        const opportunity = await opportunityModel.create({
            ...pickFields(req.body),
            createdBy: req.user.id
        });

        return res.status(201).json({
            message: "Opportunity created successfully",
            opportunity
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);

        return res.status(500).json({
            message: "Failed to create opportunity"
        });
    }
}


// GET ALL OPPORTUNITIES (public)
// Optional query: ?search=react &type=hackathon,workshop &mode=online
//                 &deadline=week|month|active &sort=newest|deadline &limit=20
async function getAllOpportunities(req, res) {

    try {

        const search = String(req.query.search ?? "").trim();
        const type = String(req.query.type ?? "");
        const mode = String(req.query.mode ?? "");
        const deadline = String(req.query.deadline ?? "");
        const sort = String(req.query.sort ?? "newest");
        const limit = Math.min(Number(req.query.limit) || 100, 100);

        const filter = {};

        if (search) {
            const text = new RegExp(escapeRegex(search), "i");
            filter.$or = [
                { title: text },
                { organization: text },
                { description: text },
                { skills: text }
            ];
        }

        if (type) {
            filter.type = { $in: type.split(",").filter(Boolean) };
        }

        if (mode) {
            filter.mode = mode;
        }

        if (deadline) {
            const today = startOfToday();
            const range = { $gte: today };

            if (deadline === "week" || deadline === "month") {
                const days = deadline === "week" ? 7 : 30;
                range.$lte = new Date(today.getTime() + days * 86400000);
            }

            filter.deadline = range;
        }

        const sortBy = sort === "deadline" ? { deadline: 1 } : { createdAt: -1 };

        const opportunities = await opportunityModel
            .find(filter)
            .sort(sortBy)
            .limit(limit);

        return res.status(200).json({
            count: opportunities.length,
            opportunities
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch opportunities"
        });
    }
}


// GET SINGLE OPPORTUNITY (public)
async function getOpportunityById(req, res) {

    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        const opportunity = await opportunityModel.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        return res.status(200).json({ opportunity });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch opportunity"
        });
    }
}


// UPDATE OPPORTUNITY (admin)
async function updateOpportunity(req, res) {

    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        const opportunity = await opportunityModel.findByIdAndUpdate(
            req.params.id,
            { $set: pickFields(req.body) },
            { returnDocument: "after", runValidators: true }
        );

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        return res.status(200).json({
            message: "Opportunity updated successfully",
            opportunity
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);

        return res.status(500).json({
            message: "Failed to update opportunity"
        });
    }
}


// DELETE OPPORTUNITY (admin)
async function deleteOpportunity(req, res) {

    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        const opportunity = await opportunityModel.findByIdAndDelete(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        // clean up anything that pointed to it
        await applicationModel.deleteMany({ opportunityId: opportunity._id });
        await savedOpportunityModel.deleteMany({ opportunityId: opportunity._id });

        return res.status(200).json({
            message: "Opportunity deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to delete opportunity"
        });
    }
}


export default {
    createOpportunity,
    getAllOpportunities,
    getOpportunityById,
    updateOpportunity,
    deleteOpportunity
};
