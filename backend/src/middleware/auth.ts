import { NextFunction,Response } from "express";
import createHttpError from "http-errors";
import { UserRequest } from "../../types";

export const  requiresAuth:any = (req:UserRequest, res:Response, next:NextFunction) =>{
      if(req.userId){
          next();
      }else{
          next(createHttpError(401,"User not authenticated"));
      }
    };