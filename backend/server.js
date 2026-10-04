import dns from "dns";

dns.setServers(["1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/db/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Backend server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();