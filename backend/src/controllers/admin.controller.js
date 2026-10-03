import mongoose from "mongoose";
import userModel from "../model/user.model.js";
import opportunityModel from "../model/opportunity.model.js";
import applicationModel from "../model/application.model.js";
import savedOpportunityModel from "../model/savedOpportunity.model.js";
import studentProfileModel from "../model/studentProfile.model.js";


// GET /api/admin/stats  → numbers for the admin dashboard
async function getStats(req, res) {

    try {

        const types = opportunityModel.schema.path("type").enumValues;

        const [
            totalOpportunities,
            totalStudents,
            totalApplications,
            pendingApplications,
            typeCounts,
            recentOpportunities
        ] = await Promise.all([
            opportunityModel.countDocuments(),
            userModel.countDocuments({ role: "student" }),
            applicationModel.countDocuments(),
            applicationModel.countDocuments({ status: "applied" }),
            Promise.all(types.map((type) => opportunityModel.countDocuments({ type }))),
            opportunityModel.find().sort({ createdAt: -1 }).limit(3)
        ]);

        const byType = types
            .map((type, i) => ({ type, count: typeCounts[i] }))
            .filter((t) => t.count > 0);

        return res.status(200).json({
            stats: {
                totalOpportunities,
                totalStudents,
                totalApplications,
                pendingApplications,
                byType
            },
            recentOpportunities
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to fetch stats" });
    }
}


// GET /api/admin/students
async function getStudents(req, res) {

    try {

        const students = await userModel
            .find({ role: "student" })
            .sort({ createdAt: -1 });

        const profiles = await studentProfileModel.find({
            userId: { $in: students.map((s) => s._id) }
        });

        const profileByUser = new Map(profiles.map((p) => [String(p.userId), p]));

        const list = students.map((s) => {
            const profile = profileByUser.get(String(s._id));

            return {
                _id: s._id,
                name: s.name,
                email: s.email,
                joinedAt: s.createdAt,
                skills: profile?.skills ?? [],
                interests: profile?.interests ?? []
            };
        });

        return res.status(200).json({ count: list.length, students: list });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to fetch students" });
    }
}


// DELETE /api/admin/students/:id  (also removes their profile, applications and saved items)
async function removeStudent(req, res) {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ message: "Student not found" });
        }

        // role: "student" in the filter → an admin account can never be deleted here
        const student = await userModel.findOne({ _id: id, role: "student" });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await student.deleteOne();

        await studentProfileModel.deleteMany({ userId: id });
        await applicationModel.deleteMany({ userId: id });
        await savedOpportunityModel.deleteMany({ userId: id });

        return res.status(200).json({ message: "Student removed" });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Failed to remove student" });
    }
}


export default { getStats, getStudents, removeStudent };
