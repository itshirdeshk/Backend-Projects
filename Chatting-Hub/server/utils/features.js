import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 15 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "Chatting-Hub" })
        .then((data) => {
            console.log(`Connected to DB: ${data.connection.host}`);
        })
        .catch((err) => {
            throw err;
        });
};

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(code).cookie("chatting-hub-token", token, cookieOptions).json({
        success: true,
        message,
    });
};

const emitEvent = (req, event, users, data) => {
    console.log("Emitting Event!", event);
};

const deleteFilesFromCloudinary = async (public_id) => {};

export {
    connectDB,
    sendToken,
    cookieOptions,
    emitEvent,
    deleteFilesFromCloudinary,
};
