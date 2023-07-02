import {ApiKeyManager} from "@esri/arcgis-rest-request";
import {geocode} from "@esri/arcgis-rest-geocoding";
import {AddressForm} from "../interfaces";

export class addressService{

    async getAddressFromLabel (address: AddressForm): Promise<Array<object>> {

        const authentication = ApiKeyManager.fromKey(process.env.MAP_KEY as string);

        const resp = await geocode({
            address: address.label,
            countryCode: "FR",
            authentication
        })

        return resp.candidates


        // if (resp.candidates.length > 0) {
        //     const address = await getOneAddressByLabel(label)
        //     if (address) {
        //         return address
        //     } else {
        //         const addressObject = resp.candidates[0]
        //         return await createAddress(addressObject.address, addressObject.location.y, addressObject.location.x)
        //     }
        // } else {
        //     return null
        // }

    }
}