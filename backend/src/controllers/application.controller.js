import mongoose from "mongoose";
import applicationModel from "../model/application.model.js";
import opportunityModel from "../model/opportunity.model.js";

// the frontend gets { _id, status, appliedAt, opportunity }
function formatApplication(application) {
    return {
        _id: application._id,
        status: application.status,
        appliedAt: application.appliedAt,
        opportunity: application.opportunityId
    };
}


// POST /api/applications   body: { opportunityId }
async function applyToOpportunity(req, res) {

    try {

        const { opportunityId } = req.body;

        if (!mongoose.isValidObjectId(opportunityId)) {
            return res.status(400).json({ message: "A valid opportunityId is required" });
        }

        const opportunity = await opportunityModel.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (opportunity.deadline && opportunity.deadline < today) {
            return res.status(400).json({
                message: "The deadline for this opportunity has passed"
            });
        }

        const existing = await applicationModel.findOne({
            userId: req.user.id,
            opportunityId
        });

        if (existing) {
            return res.status(409).json({ message: "You have already applied" });
        }

        const application = await applicationModel.create({
            userId: req.user.id,
            opportunityId
        });

        return res.status(201).json({
            message: "Application submitted",
            application
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ message: "You have already applied" });
        }

        console.error(error);

        return res.status(500).json({ message: "Failed to apply" });
    }
}


// GET /api/applications  (logged-in student's applications)
async function getMyApplications(req, res) {

    try {

        const applications = await applicationModel
            .find({ userId: req.user.id })
            .sort({ appliedAt: -1 })
            .populate("opportunityId");

        const list = applications
            .filter((a) => a.opportunityId)
            .map(formatApplication);

        return res.status(200).json({
            count: list.length,
            applications: list
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to fetch applications" });
    }
}


// GET /api/applications/:id
async function getMyApplicationById(req, res) {

    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Application not found" });
        }

        // userId in the filter → a student can only open their own application
        const application = await applicationModel
            .findOne({ _id: req.params.id, userId: req.user.id })
            .populate("opportunityId");

        if (!application || !application.opportunityId) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.status(200).json({ application: formatApplication(application) });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to fetch application" });
    }
}


export default { applyToOpportunity, getMyApplications, getMyApplicationById };
