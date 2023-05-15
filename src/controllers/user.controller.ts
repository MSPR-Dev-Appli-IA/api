import { NextFunction, Request, Response } from "express";
import { userPasswordValidation,userInfoValidation } from "../database/validation/user.validation";
import {updateUserWithUserId,UpdateUserPasswordWithUserId,UpdateUserAvatarWithUserId,deleteImageWithUserId} from "../queries/user.queries"
import  { ValidationError } from "joi";
import { newImage } from "./image.controller";
import { deleteImage } from "../queries/image.queries";
import * as fs from 'fs';

export const updateUser = async (req:Request, res:Response, _:NextFunction) => {
    try {

      await userInfoValidation.validateAsync(req.body, { abortEarly: false });
      console.log(req.body,"voila le bodyyy")
      const newUser = await updateUserWithUserId(req.user._id,req.body);
      res.status(200).json( newUser?.set("local.password",null) );
    } catch (e) {
    console.log(e)
      const errors = [];
      if (e instanceof ValidationError) {
        e.details.map((error) => {
          errors.push({ field: error.path[0], message: error.message });
        });
      }else {
        errors.push({ field: "error", message: e })
    }
      res.status(404).send({  errors });
    }
    
  };


  export const updateUserPassword= async (req:Request, res:Response, _:NextFunction) => {
    try {
      await userPasswordValidation.validateAsync(req.body, { abortEarly: false });
      const {password} = req.body
      const newUser = await UpdateUserPasswordWithUserId(req.user._id,password);
      res.status(200).json( newUser?.set("local.password",null) );
    } catch (e) {
      const errors = [];
      if (e instanceof ValidationError) {
        e.details.map((error) => {
          errors.push({ field: error.path[0], message: error.message });
        });
      }else {
        errors.push({ field: "error", message: e })
    }
      res.status(404).send({  errors });
    }
    
  };

  export const updateUserAvatar = async (req:Request, res:Response, _:NextFunction) => {
    try {
      const file = req.file as Express.Multer.File
      if (file){
        if (req.user.image){
            fs.unlinkSync("public/image/" + req.user.image.path);
            await deleteImage(req.user.image._id)
        }
        const image = await  newImage(file)
        const newImageUser = await UpdateUserAvatarWithUserId(req.user._id,image)
        res.status(200).send(newImageUser);
    }else{
        res.status(404).send("No file");
    }
    } catch (e) {
    res.status(404).send("error");
    }

  };



 //  add transaction for this one 
 export const deleteUserAvatar = async (req:Request, res:Response, _:NextFunction) => {
    try {

      const image = req.user.image
      if(image){
      const newUser = await deleteImageWithUserId(req.user._id)
      fs.unlinkSync("public/image/" + image.path);
      await deleteImage(image._id)
      res.status(200).send(newUser?.set("local.password",null));
      }else{
        res.status(404).send("Cet image n'existe pas");
      }
      

    } catch (e) {
      res.status(404).send("error");
    }
    
  };