import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    authentication:{
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    }

});

export const UserModule = mongoose.model('User', UserSchema);
export const getUsers  = ()=> UserModule.find();
export const getUserByEmail = (email: String)=> UserModule.findOne({email});
export const getUserBySessionToken = (sessionToken: String)=> UserModule.findOne({'authentication.sessionToken': sessionToken});
export const getUserbyId = (id: String)=> UserModule.findById(id);
export const createUser = (values: Record<string, any>)=> new UserModule(values).save().then((user)=> user.toObject());
export const deleteUserById = (id: String)=> UserModule.findByIdAndDelete(id);
export const updateUserById = (id: String, values: Record <string,any>) => UserModule.findByIdAndUpdate(id, values);