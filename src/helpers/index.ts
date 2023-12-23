require('dotenv').config();
import crypto from 'crypto';

export const generateRandomString = (length: number = 128): string => {
  return crypto.randomBytes(length).toString('base64');
};

export const authentication = (salt: String, password: String): String => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.API_DECODER).digest('hex');
}