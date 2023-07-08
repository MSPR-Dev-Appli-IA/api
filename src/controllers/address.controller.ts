import {NextFunction, Request, Response} from "express";
import {addressService} from "../utils/services/addressService";
import {return400or500Errors} from "../utils";
import {addressValidation} from "../database/validation/address.validation";

const AddressService = new addressService()

export const getAddressCoordinates = async (req: Request, res: Response, _: NextFunction) => {
    try{
        await addressValidation.validateAsync(req.body, { abortEarly: false });

        const addresses = await AddressService.getAddressFromLabel(req.body)
        const result: any[] = []

        addresses.forEach((item: any) => {
            result.push({
                address: item.address,
                location: {
                    x: item.location.x,
                    y: item.location.y
                },
                score: item.score
            })
        })

        res.status(200).send(result)
    }catch (e) {
        return400or500Errors(e, res)
    }
}