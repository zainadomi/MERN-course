import { NextFunction, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import UserModel from '../models/user';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { UserRequest } from "../../types";
import env from '../util/validateEnv';


// Get authenticated user 

export const getAuthenticatedUser:any = async (req:UserRequest,res:Response,next:NextFunction) =>{
        try {
            const user = await UserModel.findById(req?.userId).select('+email').exec();
            res.json(user);
            
        } catch (error) {
            next(error)
            
        }
}
// Sign up function

interface SignUpBody {

    username?: string,
    email?:string,
    password?: string,

}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        res.status(201).json(newUser);
        

    } catch (error) {
        next(error);
        
    }
};

// Log in function

interface LoginBody{

    username?: string,
    password?: string
}
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> =async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if(!username || !password){
            throw createHttpError(400, 'Parameters missing');
        }

        const user = await UserModel.findOne({username: username}).select("+password +email").exec();

        if(!user){
            throw createHttpError(401, 'Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            throw createHttpError(401, 'Invalid credentials')
        }

        if(passwordMatch){
            const token = jwt.sign(
                {
                    _id:user._id,
                    username:req.body.username,

                },
                env.JWT_SECRET
                // 'Domi412&9630'

            );

            res.json({ status: "ok", token: token, user: user });
        }} catch (error) {
            next(error)
            
        }
    
}

// logout function
export const logout: RequestHandler = async (req, res, next) => {
    try {
      // Clear the JWT token from the client-side by setting it to an empty string.
      res.cookie("jwt", "", { maxAge: 0 });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };


