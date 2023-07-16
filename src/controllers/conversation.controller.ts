import {NextFunction, Request, Response} from "express";
import {API_HOSTNAME, return400or500Errors} from "../utils";
import {findRequestByUserId} from "../queries/request.queries";
import {getOnePlantSittingByRequestId} from "../queries/plantSitting.queries";
import {findOnePlant} from "../queries/plant.queries";
import {findUserPerId} from "../queries/user.queries";
import {getLastMessageByBookerId} from "../queries/message.queries";

export const getAllUserConversation = async (req: Request, res: Response, __: NextFunction) => {
    try{
        const requests = await findRequestByUserId(req.user._id.toString())
        const result: any[] = []

        for(let i = 0; i < requests.length; i++){
            const plantSitting = await getOnePlantSittingByRequestId(requests[i]._id.toString())
            const plantInfo = await findOnePlant(plantSitting.plant._id.toString())
            const userInfo = await findUserPerId(plantInfo.user._id.toString())
            const lastMessage = await getLastMessageByBookerId(req.user._id, requests[i]._id.toString())

            result.push({
                requestId: requests[i]._id.toString(),
                userInfo: {
                    userName: userInfo.username,
                    avatar: API_HOSTNAME + userInfo.image?.path
                },
                lastMessage:{
                    content: (lastMessage[0].content) ? lastMessage[0].content : API_HOSTNAME + lastMessage[0].image?.path,
                    send_at: lastMessage[0].send_at
                }
            })
        }

        res.status(200).send({
            result: result
        })
    }catch (error){
        return400or500Errors(error, res)
    }
}