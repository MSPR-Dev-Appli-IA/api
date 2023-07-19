import {NextFunction, Request, Response} from "express";
import {API_HOSTNAME, return400or500Errors} from "../utils";
import {findUserPerId} from "../queries/user.queries";
import {
    createMessageForRequest, getAllMessageByBookerId,
    getLastMessage,
    getMessagesFor
} from "../queries/message.queries";
import {messageValidation} from "../database/validation/message.validation";
import {getOneRequestById} from "../queries/request.queries";

export class ConversationController{

    public async index (req: Request, res: Response, __: NextFunction){
        try{
            const message = await getAllMessageByBookerId(req.user._id.toString())
            const result: any[] = []

            for(let i = 0; i < message.length; i++){
                const request = await getOneRequestById(message[i].request._id.toString())
                const userInfo = await findUserPerId(message[i].receiver._id.toString())
                const lastMessage = await getLastMessage(message[i].request._id.toString())

                result.push({
                    requestId: request._id.toString(),
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

    public async show(req: Request, res: Response, __: NextFunction) {
        try {
            const result: any[] = []

            // Check If user exists in db
            await findUserPerId(req.params.userId)

            const messages = await getMessagesFor(
                req.user._id.toString(), req.params.userId)

            for(let i = 0; i < messages.length; i++){
                result.push({
                    sender: {
                        userName: messages[i].sender.username,
                        avatar: API_HOSTNAME + messages[i].sender.image?.path
                    },
                    receiver: {
                        userName: messages[i].receiver.username,
                        avatar: API_HOSTNAME + messages[i].receiver.image?.path
                    },
                    content: (messages[i].content) ? messages[i].content : API_HOSTNAME + messages[i].image?.path,
                    send_at: messages[i].send_at
                })
            }

            res.status(200).send({
                result: result
            })
        }catch (e){
            return400or500Errors(e, res)
        }
    }

    public async store(req: Request, res: Response, __: NextFunction) {
        try {
            await messageValidation.validateAsync(req.body, { abortEarly: false });

            await createMessageForRequest(
                req.sender,
                req.receiver,
                req.body.requestId,
                req.body.content,
            )

            res.status(200).send({
                status: "sucess",
                message: "Message sent."
            })
        } catch (e) {
            return400or500Errors(e, res)
        }
    }

}