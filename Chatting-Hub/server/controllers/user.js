import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOptions, emitEvent, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

// Create a new user -> save it to the database -> save token in cookie.
const newUser = async (req, res) => {
    const { name, username, password, bio } = req.body;

    const avatar = {
        public_id: "1234",
        url: "asdfs",
    };

    const user = await User.create({
        name,
        username,
        password,
        bio,
        avatar,
    });

    sendToken(res, user, 201, "User Created...");
};

// Login the user -> save token in cookie
const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user)
        return next(new ErrorHandler("Invalid Username Or Password!", 400));

    const isMatch = await compare(password, user.password);

    if (!isMatch)
        return next(new ErrorHandler("Invalid Username Or Password!", 400));

    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user);

    res.status(200).json({
        success: true,
        user,
    });
});

const logout = TryCatch(async (req, res) => {
    res.status(200)
        .cookie("chatting-hub-token", "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged Out Successfully!",
        });
});

const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    res.status(200).json({
        success: true,
        users,
    });
});

const sendFriendRequest = TryCatch(async (req, res) => {
    const { userId } = req.body;

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, reciever: req.user },
        ],
    });

    if (request) return next(new ErrorHandler("Request already sent", 400));

    await Request.create({
        sender: req.user,
        receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    res.status(200).json({
        success: true,
        message: "Friend Request Sent",
    });
});

const acceptFriendRequest = TryCatch(async (req, res) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("reciever", "name");

    if (!request) return next(new ErrorHandler("Request not found", 400));

    if (request.receiver.toString() !== req.user.toString())
        return next(
            new ErrorHandler(
                "You are not authorized to accept this request",
                403
            )
        );

    if (!accept) {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend Request Rejected",
        });
    }

    const members = [request.sender.name, request.reciever.name];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name}-${request.reciever.name}`,
        }),
        request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id
    });
});

export {
    login,
    newUser,
    getMyProfile,
    logout,
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
};
