import express from 'express';
import authentication from './authentication';

const Router = express.Router();

export default (): express.Router => {

    authentication(Router);
    return Router;
}