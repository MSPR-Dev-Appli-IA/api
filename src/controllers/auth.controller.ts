import  { findUserPerEmail, createUser } from "../queries/user.queries";
import  {userSignupValidation} from "../database/validation/user.validation";
import { NextFunction, Request, Response } from "express";
import  { ValidationError } from "joi";
import {getDefaultRole,getBotanistRole} from "../queries/role.queries";


export const login = async (req:Request, res:Response, _:NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await findUserPerEmail(email);

    if (user) {
      const match =  user.comparePassword(password);
      if (match) {
        req.login(user);
        res.status(200).json(user.set("local.password",null));
      } else {
        res.status(404).json( [{ field: "password", message: "Mauvais identifiants" }] );
      }
    } else {
    res.status(404).json(  [{ field: "password", message: "Mauvais identifiants" }]  );
    }
  } catch (e) {
    res.status(404).json( "error" );
  }
};

export const me = async (req:Request, res:Response) => {
  try {
    if (req.user) {
      res.json(req.user.set("local.password",null));
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(404).json( "error" );
  }
};

export const signout = async (req:Request, res:Response, _:NextFunction) => {
  try {
    req.logout();
    res.status(200).send();
  } catch (error) {
    res.status(404).json( "error" );
  }
};


export const signup = async (req:Request, res:Response, _:NextFunction) => {

    try {
    await userSignupValidation.validateAsync(req.body, { abortEarly: false });

    const body = req.body;

    const role = await getDefaultRole();
    const user = (await createUser(body, role)).set("local.password",null);

    req.login(user);
    res.json(user)
    } catch (e) {
    const errors = [];
    if (e instanceof ValidationError) {
      e.details.map((error) => {
        errors.push({ field: error.path[0], message: error.message });
      });
    } else {
        errors.push({ field: "error", message: e })
    }
    res.status(404).send(errors);
  }
};

export const createAccountWithBotanistRight = async () => {
  try {
  const body = {"username":"defaultBotanist","firstname":"John","lastname":"doe","email":"botanist@email.fr","password":"123456"};
  const role = await getBotanistRole();
  await createUser(body, role)
  } catch (e) {
  throw(e)
}
};