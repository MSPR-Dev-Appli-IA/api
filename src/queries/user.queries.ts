import {User} from "../database/models/user.model";
import {IRole, UserForm,UserInfo,IImage} from "../interfaces";
import { Types } from 'mongoose';

export const findUserPerEmail = (email:string) => {
  return User.findOne({ "local.email": email }).exec();
};

export const findUserPerId = (id:string) => {
  const request = User.findById(id).populate("role").populate("image").exec();
  if(request){
    return request
  }
  throw new Error("Failed to find user per id")
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
      role: role,
      plants: []
    });
    return await newUser.save();
  } catch (e) {
    throw e;
  }
};



export const updateUserWithUserId = async (userId: Types.ObjectId, user: UserInfo) => {

  if(typeof user.password !== 'undefined'){
    user.password = await User.hashPassword(user.password);
  }

  return User.findByIdAndUpdate(userId, Object.fromEntries(Object.entries(user)), {new: true}).populate("image")
};


export const UpdateUserAvatarWithUserId = async (userId: Types.ObjectId, image: IImage) => {
  return await User.findByIdAndUpdate(userId, {
    image: image
  },
    { new: true }).populate("image")

};

export const deleteImageWithUserId= async (userId: string) => {
  return await User.findByIdAndUpdate(userId, {
    image:null,
  },
    { new: true }).populate("image")
}


export const addUserJWTToken = async (userId: string, jwtToken: string) => {
  const request = await User.findByIdAndUpdate(userId, {
        $set: {
          "jwtToken": jwtToken,
        },
      },
      {new: true});

  if(request){
    return request
  }
  throw new Error("Failed to add JwtToken in DB")
}