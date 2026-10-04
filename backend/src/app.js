import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import savedRoutes from "./routes/saved.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/admin", adminRoutes);

// React frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(frontendPath));

// React Router fallback
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;