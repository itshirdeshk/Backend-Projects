const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/insta-clone");

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
