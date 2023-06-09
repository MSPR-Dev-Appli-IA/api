import {Role} from "../database/models/role.model";
import {IRole} from "../interfaces";

export const getDefaultRole = async () : Promise<IRole> => {
    let role = await Role.findOne({ name: "User"}).exec()

    if(!role){
        role = await new Role({name: "User"}).save();
    }
    return role
};

export const getBotanistRole = async () : Promise<IRole> => {
    let role = await Role.findOne({ name: "Botanist"}).exec()

    if(!role){
        role = await new Role({name: "Botanist"}).save();
    }
    return role
};

export const getAdminRole = async () : Promise<IRole> => {
    let role = await Role.findOne({ name: "Admin"}).exec()

    if(!role){
        role = await new Role({name: "Admin"}).save();
    }
    return role
};