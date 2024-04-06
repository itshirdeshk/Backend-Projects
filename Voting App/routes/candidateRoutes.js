const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate.js");
const { jwtAuthMiddleware } = require("../jwt.js");
const User = require("../models/user.js");

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user.role === "admin") {
            return true;
        }
    } catch (error) {
        return false;
    }
};

// POST route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user?.id)))
            return res
                .status(403)
                .json({ message: "User deos not have admin role!" });

        const data = req.body;

        const newCandidate = new Candidate(data);

        // Save the new user to the datatbase
        const response = await newCandidate.save();
        console.log(`Data Saved!`, response);

        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user?.id)))
            return res
                .status(403)
                .json({ message: "User deos not have admin role!" });

        const candidateId = req.params.candidateID;
        console.log(candidateId);
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(
            candidateId,
            updatedCandidateData,
            { new: true, runValidators: true }
        );

        if (!response) res.status(401).json({ error: "Candidate not found!" });

        console.log("Candidate Updated!");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user?.id)))
            return res
                .status(403)
                .json({ message: "User deos not have admin role!" });

        const candidateId = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response)
            return res.status(401).json({ error: "Candidate not found!" });

        console.log("Candidate Deleted!");
        return res.status(200).json({ messsage: "Candidate Deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

router.get("/", async (req, res) => {
    // List of all candidates
    const candidates = await Candidate.find().sort({ party: "asc" });

    if (!candidates)
        return res.status(401).json({ message: "Candidates not found!" });

    const result = candidates.map((candidate) => {
        return candidate.party;
    });

    return res.status(200).json(result);
});

// Let's start voting
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
    // no admin can vote
    // user can only vote once

    const candidateId = req.params.candidateID;
    const userId = req.user.id;

    try {
        // Find the candidate document using candidateId
        const candidate = await Candidate.findById(candidateId);
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found!" });

        // Find the user document using userId
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        if (user.isVoted)
            return res.status(400).json({ message: "You have already voted!" });

        if (user.role === "admin")
            return res
                .status(400)
                .json({ message: "Admin don't have the permission to vote!" });

        // Update the candidate document to record the vote
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        // Update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "Vote recorded successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

// Vote count
router.get("/vote/count", async (req, res) => {
    try {
        // Find all candidates and sort them by voteCount in descending order
        const candidates = await Candidate.find().sort({ voteCount: "desc" });

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount,
            };
        });

        return res.status(200).json(voteRecord);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

module.exports = router;
