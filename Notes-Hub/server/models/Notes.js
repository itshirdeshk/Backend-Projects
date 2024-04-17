const mongoose = require("mongoose");
const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Note", notesSchema);
