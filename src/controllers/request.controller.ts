import {NextFunction, Request, Response} from "express";
import {createRequestValidation, defaultRequestValidation} from "../database/validation/requests.validation";
import {API_HOSTNAME, return400or500Errors} from "../utils";
import {RequestService} from "../utils/services/requestService";
import {findUserPerId} from "../queries/user.queries";
import {getAllMessageByBookerId} from "../queries/message.queries";
import {findWaitingRequestForPlantSittingByUserId} from "../queries/request.queries";

const requestService = new RequestService();

export const getRequestsForMyPlantsSittings = async (req: Request, res: Response, __: NextFunction) => {
    try {
        const result: any[] = []
        const formatMessage: any[] = []

        const plantSittings = await findWaitingRequestForPlantSittingByUserId(req.user)

        for (const request of plantSittings) {
            const bookerInfo = await findUserPerId(request.booker._id.toString())
            const messages = await getAllMessageByBookerId(request.booker._id.toString(), request._id.toString())

            for (const message of messages) {
                const senderInfo = await findUserPerId(message.sender._id.toString())
                const receiverInfo = await findUserPerId(message.receiver._id.toString())
                formatMessage.push({
                    sender: {
                        userName: senderInfo.username,
                        avatar: API_HOSTNAME + senderInfo.image?.path
                    },
                    receiver: {
                        userName: receiverInfo.username,
                        avatar: API_HOSTNAME + receiverInfo.image?.path
                    },
                    content: (message.content) ? message.content : API_HOSTNAME + message.image.path,
                    send_at: message.send_at
                })
            }

            result.push({
                requestId: request._id,
                requestStatus: request.status,
                bookerInfo: {
                    userName: bookerInfo.username,
                    avatar: API_HOSTNAME + bookerInfo.image?.path
                },
                messages: formatMessage
            })
        }

        res.status(200).send({
            result: result
        })
    } catch (e) {
        return400or500Errors(e, res)
    }
}

export const newRequest = async (req: Request, res: Response, __: NextFunction) => {

    try {

        await createRequestValidation.validateAsync(req.body, {abortEarly: false})

        await requestService.create(req)

        res.status(200).send({
            "status": "success",
            "message": "Request sent."
        })

    } catch (e) {
        return400or500Errors(e, res)
    }

};


export const acceptRequest = async (req: Request, res: Response, __: NextFunction) => {
    try {
        await defaultRequestValidation.validateAsync(req.body, {abortEarly: false})

        await requestService.accept(req.body.requestId)

        res.status(200).send({
            "status": "success",
            "message": "Request accepted."
        });

    } catch (e) {
        return400or500Errors(e, res)
    }

};


export const refuseRequest = async (req: Request, res: Response, __: NextFunction) => {
    try {

        await defaultRequestValidation.validateAsync(req.body, {abortEarly: false})

        await requestService.refuse(req.body.requestId)

        res.status(200).send({
            "status": "success",
            "message": "Request refused."
        });

    } catch (e) {
        return400or500Errors(e, res)
    }
};


export const removeRequest = async (req: Request, res: Response, __: NextFunction) => {

    try {

        await requestService.delete(req.params.requestId)


        res.status(200).send({
            "type": "success",
            "message": "Request deleted."
        })

    } catch (e) {
        return400or500Errors(e, res)
    }

};
























