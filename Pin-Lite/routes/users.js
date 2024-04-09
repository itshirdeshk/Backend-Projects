const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const dotenv = require("dotenv");

dotenv.config({
    path: "./.env",
});

mongoose
    .connect(`${process.env.MONGODB_URI}/pin-lite`)
    .then(() => console.log("Connected!"))
    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    email: String,
    password: String,
    profileImage: String,
    contact: Number,
    boards: {
        type: Array,
        default: [],
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
});
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
