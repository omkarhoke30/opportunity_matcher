import mongoose from "mongoose";
import savedOpportunityModel from "../model/savedOpportunity.model.js";
import opportunityModel from "../model/opportunity.model.js";


// GET /api/saved  → the opportunities the student has saved
async function getSaved(req, res) {

    try {

        const saved = await savedOpportunityModel
            .find({ userId: req.user.id })
            .sort({ savedAt: -1 })
            .populate("opportunityId");

        const opportunities = saved
            .map((s) => s.opportunityId)
            .filter(Boolean);

        return res.status(200).json({
            count: opportunities.length,
            opportunities
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to fetch saved opportunities" });
    }
}


// POST /api/saved/:opportunityId
async function saveOpportunity(req, res) {

    try {

        const { opportunityId } = req.params;

        if (!mongoose.isValidObjectId(opportunityId)) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        const opportunity = await opportunityModel.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        const existing = await savedOpportunityModel.findOne({
            userId: req.user.id,
            opportunityId
        });

        // saving twice is not an error, it just stays saved
        if (!existing) {
            await savedOpportunityModel.create({
                userId: req.user.id,
                opportunityId
            });
        }

        return res.status(200).json({ message: "Opportunity saved" });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to save opportunity" });
    }
}


// DELETE /api/saved/:opportunityId
async function unsaveOpportunity(req, res) {

    try {

        const { opportunityId } = req.params;

        if (!mongoose.isValidObjectId(opportunityId)) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        await savedOpportunityModel.deleteOne({
            userId: req.user.id,
            opportunityId
        });

        return res.status(200).json({ message: "Opportunity removed from saved" });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to remove saved opportunity" });
    }
}


export default { getSaved, saveOpportunity, unsaveOpportunity };
