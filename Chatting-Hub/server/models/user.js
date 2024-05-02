import { hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        bio: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatar: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return next();
    this.password = await hash(this.password, 10);
})

export const User = mongoose.models.User || mongoose.model("User", userSchema);
