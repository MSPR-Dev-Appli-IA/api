import {NextFunction, Request, Response} from "express";
import {getOneRequestById} from "../queries/request.queries";
import {findOnePlantSittinWithRequest } from "../queries/plantSitting.queries";
import {getOnePlantById} from "../queries/plant.queries";
import {HttpError} from "../utils/HttpError";
import {return400or500Errors} from "../utils";

export class ConversationMiddleware{
    public async talkTo (req: Request, res: Response, next: NextFunction){
        try {
            if (req.body.requestId){
                const request = await getOneRequestById(req.body.requestId)
                const plantSitting = await findOnePlantSittinWithRequest  (req.body.requestId)
                const plant = await getOnePlantById(plantSitting.plant._id.toString())

                req.receiver = (req.user._id.equals(request.booker._id)) ? plant.user._id.toString() : request.booker._id.toString()
            }else{
                req.receiver = req.params.userId
            }

            req.sender = req.user._id.toString()


            if (req.sender !== req.receiver) {
                next()
            }else{
                throw new HttpError(401, "You are not authorized to send a message to this user.")
            }

        } catch (e) {
            return400or500Errors(e, res)
        }
    }
}

