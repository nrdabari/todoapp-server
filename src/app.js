import express from "express";
import apiRoute, { apiProtected } from "./routes/api.js";
import mongoose from "mongoose";
import { DB_CONNECT } from "./utils/constant.js";
import AuthMiddleware from "./middlewares/AuthMidleware.js";
import cors from 'cors';

const app = express();

async function startApp() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to the database...");

        const PORT = 8000;
        app.use(cors());
        app.use(express.json());
        app.use('/api/', apiRoute);
        app.use('/api/',AuthMiddleware, apiProtected);

        app.listen(PORT, () => {
            console.log("Server is running on port " + PORT);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

startApp();
