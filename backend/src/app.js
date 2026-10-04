import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import savedRoutes from "./routes/saved.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Opportunity Matcher API is running"
    });
});

export default app;