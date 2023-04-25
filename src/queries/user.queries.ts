import {User} from "../database/models/user.model";
import {IRole, UserForm} from "../interfaces";

export const findUserPerEmail = (email:string) => {
  return User.findOne({ "local.email": email }).exec();
};

export const findUserPerId = (id:string) => {
  return User.findById(id).populate("role").exec();
};

export const createUser= async (user :UserForm, role :IRole) => {
  try {
    const hashedPassword =  await User.hashPassword(user.password);
    const newUser  = new User({
      username: user.username,
      firstname:user.firstname,
      lastname:user.lastname,
      local: {
        email: user.email,
        password: hashedPassword,
      },
      role: role
    });
    return await newUser.save();
  } catch (e) {
    throw e;
  }
};