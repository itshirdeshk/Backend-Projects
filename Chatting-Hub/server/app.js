import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Import of Routes
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";


app.use("/user", userRoute);
app.use("/chat", chatRoute);

// Home Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
