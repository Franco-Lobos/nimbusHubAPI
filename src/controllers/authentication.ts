import express from 'express';
import { getUserByEmail , createUser} from '../db/users';
import { generateRandomString, authentication } from '../helpers';

require('dotenv').config();


export const login = async(req: express.Request, res: express.Response)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if(!user){
            return res.sendStatus(400); //TODO REDIRECT TO SIGN UP
        }

        const expectedHash =  authentication(user.authentication.salt, password);

        if(expectedHash !== user.authentication.password){
            return res.sendStatus(403); // TODO RETURN WRONG PASSWORD
        }

        const salt = generateRandomString();

        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save(); 

        res.cookie('NIMBUS-AUTH', user.authentication.sessionToken, {httpOnly: true }); 
        return res.status(200).json(user).end();

    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register  = async(req: express.Request, res: express.Response)=>{
    try{
        const {email, password, username} = req.body;  

        if(!email || !password || !username){
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email);

        if(user){
            return res.sendStatus(409);
        }

        const salt = generateRandomString();

        const newUser = await createUser({
            email,
            username,
            authentication:{
                salt,
                password: authentication(salt, password),
            }
        });

        return res.status(200).json(newUser).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}