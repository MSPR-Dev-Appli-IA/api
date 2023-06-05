import {NextFunction, Request, Response} from "express";
import {userInfoValidation} from "../database/validation/user.validation";
import {updateUserWithUserId, UpdateUserAvatarWithUserId, deleteImageWithUserId} from "../queries/user.queries"
import {newImage} from "./image.controller";
import {deleteImage} from "../queries/image.queries";
import * as fs from 'fs';
import {API_HOSTNAME, API_VERSION, return400or500Errors} from "../utils";

export const updateUser = async (req: Request, res: Response, _: NextFunction) => {
    try {

        await userInfoValidation.validateAsync(req.body, {abortEarly: false});

        const newUser = await updateUserWithUserId(req.user._id, req.body);
        if (newUser) {
            res.status(200).json({
                "status": "success",
                "userInfo": API_HOSTNAME + "/api" + API_VERSION + "/auth/me"
            });
        } else {
            res.status(500).send({
                field: ["error"],
                message: ["An error was occurred. Please contact us."]
            });
        }
    } catch (e) {
        return400or500Errors(e, res)
    }

};

export const updateUserAvatar = async (req: Request, res: Response, _: NextFunction) => {
    try {
        const file = req.file as Express.Multer.File
        if (file) {
            if (req.user.image) {
                fs.unlinkSync("public/image/" + req.user.image.path);
                await deleteImage(req.user.image._id)
            }
            const image = await newImage(file)
            const newImageUser = await UpdateUserAvatarWithUserId(req.user._id, image)
            if (image && newImageUser) {
                res.status(200).json({
                    "status": "success",
                    "userInfo": API_HOSTNAME + "/api" + API_VERSION + "/auth/me"
                });
            } else {
                res.status(500).send({
                    field: ["error"],
                    message: ["An error was occurred. Please contact us."]
                });
            }
        } else {
            res.status(400).send({
                field: ["error"],
                message: ["The file attribute is not found"]
            });
        }
    } catch (e) {
        return400or500Errors(e, res)
    }
};


export const deleteUserAvatar = async (req: Request, res: Response, _: NextFunction) => {
    try {

        const image = req.user.image
        if (image) {
            const newUser = await deleteImageWithUserId(req.user._id)
            fs.unlinkSync("public/image/" + image.path);
            await deleteImage(image._id)
            if (newUser) {
                res.status(200).send({
                    "type": "success",
                    "message": "File deleted"
                });
            } else {
                res.status(500).send({
                    field: ["error"],
                    message: ["An error was occurred. Please contact us."]
                });
            }
        } else {
            res.status(404).send({
                field: ["error"],
                message: ["Image not found. Please Add image before."]
            });
        }

    } catch (e) {
        return400or500Errors(e, res)
    }

};