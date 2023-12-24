import express from 'express';
import {get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/users';


export const isOwner = async (req:express.Request, res:express.Response, next: express.NextFunction) => {
    try{
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            res.sendStatus(403);
        }

        if(currentUserId.toString() !== id){
            res.sendStatus(403);
        }

        next();

    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}

export const isAuthenticated = async (req:express.Request, res:express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['NIMBUS-AUTH'];
        if(!sessionToken){
            return res.sendStatus(403);
        }

        const extingUser = await getUserBySessionToken (sessionToken);
        if(!extingUser){
            return res.sendStatus(403);
        }

        merge(req, {identity:extingUser});

        return next();

    }catch(error){
        console.log(error);
        res.status(400);
    }
}