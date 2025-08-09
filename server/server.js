import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is listening...")
});

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter)

app.listen(PORT, async() =>{
    try {
        await connectDB;
        console.log("Connected to the database successfully");
        console.log(`Server is running on port http://localhost:${PORT}`);
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
});
