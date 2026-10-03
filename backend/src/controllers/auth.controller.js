import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// A function (not a constant) so process.env is read after dotenv has loaded.
// Same options must be used for setting AND clearing the cookie.
function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };
}

function signToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

// Only these fields are ever sent to the frontend
function publicUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim() !== "";
}

// POST /api/auth/register
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        // typeof checks also block objects like { "$gt": "" } (NoSQL injection)
        if (
            !isNonEmptyString(name) ||
            !isNonEmptyString(email) ||
            typeof password !== "string" ||
            password.length < 6
        ) {
            return res.status(400).json({
                message:
                    "Name, email and a password of at least 6 characters are required",
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        const existingUser = await userModel.findOne({ email: cleanEmail });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 10 = salt rounds: higher is slower for attackers (and for you)
        const passwordHash = await bcrypt.hash(password, 10);

        // role is NEVER read from req.body → everyone who registers is a student
        const user = await userModel.create({
            name: name.trim(),
            email: cleanEmail,
            passwordHash,
        });

        res.cookie("token", signToken(user), {
            ...cookieOptions(),
            maxAge: SEVEN_DAYS_MS,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: publicUser(user),
        });
    } catch (error) {
        // two requests registering the same email at the same moment
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        console.error(error);

        return res.status(500).json({ message: "Registration failed" });
    }
}

// POST /api/auth/login
// The Student/Admin toggle on the login page is NOT sent or trusted here.
// The role comes from the database and is returned so the frontend can redirect.
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!isNonEmptyString(email) || typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await userModel
            .findOne({ email: email.toLowerCase().trim() })
            .select("+passwordHash");

        const isPasswordValid =
            user && (await bcrypt.compare(password, user.passwordHash));

        // same message for "no such user" and "wrong password"
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.cookie("token", signToken(user), {
            ...cookieOptions(),
            maxAge: SEVEN_DAYS_MS,
        });

        return res.status(200).json({
            message: "Logged in successfully",
            user: publicUser(user),
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Login failed" });
    }
}

// GET /api/auth/me  (frontend calls this on page load to restore the session)
async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        return res.status(200).json({ user: publicUser(user) });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "Failed to get user" });
    }
}

// POST /api/auth/logout
function logoutUser(req, res) {
    res.clearCookie("token", cookieOptions());

    return res.status(200).json({ message: "Logged out successfully" });
}

export default { registerUser, loginUser, getMe, logoutUser };
