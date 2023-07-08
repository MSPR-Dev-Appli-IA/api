import {ApiKeyManager} from "@esri/arcgis-rest-request";
import {geocode} from "@esri/arcgis-rest-geocoding";
import {AddressForm, IAddress} from "../../interfaces";
import {createAddress, getOneAddressByCoordinates} from "../../queries/address.queries";

export class addressService{

    async getAddressFromLabel (address: AddressForm): Promise<Array<object>> {

        const authentication = ApiKeyManager.fromKey(process.env.MAP_KEY as string);

        const resp = await geocode({
            address: address.label,
            countryCode: "FR",
            authentication
        })

        return resp.candidates
    }

    async getOrCreateAddress(address: IAddress){

        const addressInfo = await getOneAddressByCoordinates(address)

        if(addressInfo){
            return addressInfo
        }else{
            return await createAddress(address)
        }
    }
}