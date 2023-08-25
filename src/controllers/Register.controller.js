import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode,JWT_TOKEN_SECRET } from "../utils/constant.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const Register=async (req,res)=>{

    
   const errors=validationResult(req);
    if(errors.isEmpty()){
        const {name,username,password,email}=req.body;

        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);

        
        const userExist=await User.findOne({$or:[{
            email:email},{
                username:username
            
        }]})
        if(userExist){
            return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY,"User and Email already exists"));
        }
        //save to db
       
const result=await User.create({
    name:name,
    email:email,
    password:hashPassword,
    username:username
});

const token=Jwt.sign({userId:result._id},JWT_TOKEN_SECRET)
return res.json(jsonGenerate(StatusCode.SUCCESS,"Registration successfull",{userId:result._id,token:token}));
        


    }
    return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR,"validation error",errors.mapped()));
}

export default Register;