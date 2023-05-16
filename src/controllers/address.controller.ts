
import { ApiKeyManager } from '@esri/arcgis-rest-request';
import { geocode } from '@esri/arcgis-rest-geocoding';
import { getOneAddressByLabel, createAddress } from '../queries/address.queries';
import { IAddress } from '../interfaces';



export const getAddressFromLabel = async (label: string): Promise<IAddress| null> => {
    try {
        const authentication = ApiKeyManager.fromKey(process.env.MAP_KEY as string);
        const resp = await geocode({
            address: label,
            countryCode: "FR",
            authentication
        })
        if (resp.candidates.length > 0) {
            const address = await getOneAddressByLabel(label)
            if (address) {
                return address
            } else {
                const addressObject = resp.candidates[0]
                return await createAddress(addressObject.address, addressObject.location.y, addressObject.location.x)
            }
        } else {
            return null
        }
    } catch (e) {
        return null
    }
};
