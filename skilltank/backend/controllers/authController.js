const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mentee = require("../models/mentee");
const Mentor = require("../models/mentor");

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        console.log("🔄 Checking for existing user:", email);

        const isMentee = await Mentee.findOne({ email });
        const isMentor = await Mentor.findOne({ email });
        console.log("🛠 Checking for existing user...");
        console.log("🔍 Mentee found:", isMentee);
        console.log("🔍 Mentor found:", isMentor);
        if (isMentee || isMentor) {
            console.log("❌ User already exists:", isMentee || isMentor);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user based on role
        let newUser;
        if (role === "mentee") {
            newUser = new Mentee({ name, email, password: hashedPassword, role });
        } else {
            newUser = new Mentor({ name, email, password: hashedPassword, role });
        }

        await newUser.save();
        console.log("✅ New user created:", newUser);

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Store user details in local storage
        res.status(201).json({ 
            token, 
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role } 
        });

    } catch (error) {
        console.error("❌ Signup error:", error);
        res.status(500).json({ message: "Signup error", error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    console.log("🔄 Login Request:", req.body);

    if (!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check in correct collection based on role
        const user = role === "mentee" ? await Mentee.findOne({ email }) : await Mentor.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        console.log("✅ Login Successful:", user);

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role } 
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "Login error", error: error.message });
    }
};
 
exports.checkUserStatus = async (req, res) => {
    const { id } = req.params;

    const mentee = await Mentee.findById(id);
    const mentor = await Mentor.findById(id);

    if (!mentee && !mentor) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User exists" });
};
