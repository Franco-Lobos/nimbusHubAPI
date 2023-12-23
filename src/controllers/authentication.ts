import express from 'express';
import { getUserByEmail , createUser} from '../db/users';
import { generateRandomString, authentication } from '../helpers';

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