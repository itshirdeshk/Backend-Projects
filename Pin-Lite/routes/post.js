const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pin-lite");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    description: String,
    image: String,
});

module.exports = mongoose.model("Post", postSchema);
