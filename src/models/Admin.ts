import { model, Mongoose,Document } from "mongoose"

const mongoose=require("mongoose")

const AdminSchema=new mongoose.Schema({
    uname:{type:String,required:true},
    password:{type: String, required:true},
    type:{type:String,required:true},
})
export interface AdminDoc extends Document
{
    uname: string,
    password: string,
    type:string,
}

export default model<AdminDoc>("Admin",AdminSchema)