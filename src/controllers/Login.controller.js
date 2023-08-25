import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode, JWT_TOKEN_SECRET } from "../utils/constant.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const Login = async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { password, email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json(
                jsonGenerate(
                    StatusCode.UNPROCESSABLE_ENTITY,
                    "Email and Password is incorrect"
                )
            );
        }
       
        const verified = await bcrypt.compareSync(password, user.password);

        if (!verified) {
           
            return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Email and Password is incorrect"));
        }

        // Save to db
        try {
            const token = Jwt.sign({ userId: user._id }, JWT_TOKEN_SECRET);
            return res.json(jsonGenerate(StatusCode.SUCCESS, "Login successful", { userId: user._id, token: token }));
        } catch (error) {
            console.log(error);
        }
    } else {
        return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "Validation error", errors.mapped()));
    }
};

export default Login;
