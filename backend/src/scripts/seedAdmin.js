// Run once from the project root:  npm run seed:admin
//
// Needs these in .env:
//   MONGO_URI            (use the same variable name your db.js reads)
//   SEED_ADMIN_EMAIL
//   SEED_ADMIN_PASSWORD
//   SEED_ADMIN_NAME      (optional)

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";
import userModel from "../model/user.model.js";

dns.setServers(["1.1.1.1"]);

async function seedAdmin() {

    const name = process.env.SEED_ADMIN_NAME || "Admin";
    const email = (process.env.SEED_ADMIN_EMAIL || "").toLowerCase().trim();
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env first.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {

        // account already exists (e.g. registered as a student) → promote it
        existingUser.role = "admin";
        await existingUser.save();
        console.log(`Existing user ${email} promoted to admin.`);

    } else {

        const passwordHash = await bcrypt.hash(password, 10);

        await userModel.create({
            name,
            email,
            passwordHash,
            role: "admin"
        });

        console.log(`Admin ${email} created.`);
    }

    await mongoose.disconnect();
}

seedAdmin().catch((error) => {
    console.error(error);
    process.exit(1);
});