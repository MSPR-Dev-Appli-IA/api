import  jwt,{JwtPayload}  from "jsonwebtoken";
import  {findUserPerId} from "../queries/user.queries";
import  {key} from '../env/keys';
import  {app} from "../index";
import { IUser,UserjwtToken } from "../interfaces";
import { NextFunction, Request, Response } from "express";


const createJwtToken = ({ user, id }:UserjwtToken) => {
  
  const jwtToken = jwt.sign(
    {
      sub: id || user?._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 5,
    },
    key
  );
  return jwtToken;
};

const decodeJwtToken = (token:string) => {
  return jwt.verify(token, key);
};

exports.decodeJwtToken = decodeJwtToken;

exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token:JwtPayload, res:Response) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);
  if (tokenExp){
  if (nowInSec <= tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && nowInSec - tokenExp < 60 * 60 * 24) {
    const refreshedToken = createJwtToken({user: null,id: token.sub });
    res.cookie("jwt", refreshedToken);
    return jwt.verify(refreshedToken, key);
  } else {
    throw new Error("token expired");
  }
}
return;
};

const extractUserFromToken = async (req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const  decodedToken   = jwt.verify(token, key, { ignoreExpiration: true }) as JwtPayload ;
      const decodedTokenCheck = checkExpirationToken(decodedToken  , res);
      if (decodedTokenCheck){
      const user = await findUserPerId(decodedTokenCheck.sub as string);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        res.json(null)
      }
      }else{
        res.clearCookie("jwt");
        res.json(null)
      }
    } catch (e) {
      res.clearCookie("jwt");
      res.json(null)
    }
  } else {
    next();
  }
};

const addJwtFeatures = (req:Request, res:Response, next:NextFunction) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");
  req.login = (user:IUser) => {
    const token = createJwtToken({ user,id:undefined });
    res.cookie("jwt", token);
  };
  next();
};

app.use(extractUserFromToken);
app.use(addJwtFeatures);
