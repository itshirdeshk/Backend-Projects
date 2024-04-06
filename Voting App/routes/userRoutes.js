const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { jwtAuthMiddleware, generateToken } = require("../jwt.js");

// POST route to add a user
router.post("/signup", async (req, res) => {
    try {
        const data = req.body;

        // Check if there is already an admin user exists
        const adminUser = await User.find({ role: "admin" });
        if (data.role === "admin" && adminUser)
            return res
                .status(400)
                .json({ message: "Admin user already exists!" });

        // Validate Aadhar Card Number that it contains exactly 12 digits
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({
                error: "Aadhar Card Number must be exactly 12 digits",
            });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({
            aadharCardNumber: data.aadharCardNumber,
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User with the same Aadhar Card Number already exists",
            });
        }

        const newUser = new User(data);

        // Save the new user to the datatbase
        const response = await newUser.save();
        console.log(`Data Saved!`, response);

        const payload = {
            id: response._id,
        };

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is: ", token);

        res.status(200).json({ response: response, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        // Extract the login details from the request body
        const { aadharCardNumber, password } = req.body;

        // Find the user by aadharCardNumber
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        if (!user || !(await user.comparePassword(password)))
            return res
                .status(401)
                .json({ error: "Invalid aadharCardNumber and password!" });

        // generate token
        const payload = {
            id: user._id,
        };

        const token = generateToken(payload);

        // return the token as response
        res.json(token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);

        const { currentPassword, newPassword } = req.body;

        if (!(await user.comparePassword(currentPassword))) {
            res.status(401).json({ error: "Wrong current password!" });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log("Password Updated!");
        res.status(200).json({ messsage: "Password Updated!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

module.exports = router;
