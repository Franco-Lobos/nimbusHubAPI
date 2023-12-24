import express from 'express';
import authentication from './authentication';
import users from './users';

const Router = express.Router();

export default (): express.Router => {
    authentication(Router);
    users(Router);
    
    return Router;
}