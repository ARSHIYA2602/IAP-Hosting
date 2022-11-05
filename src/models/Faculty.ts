import { model, Mongoose,Document } from "mongoose"

const mongoose=require("mongoose")

const FacultySchema=new mongoose.Schema({
    initial:{type: String, required:true},
    fname:{type: String, required:true},
    created_at: {type:Date, required:true,default: new Date()},
    updated_at: {type:Date, required:true,default: new Date()},
    type: {type: String, required: true},
    designation: {type: String, required: true},
    department: {type: String, required: true},
    phno:{type: String, required:true},
    email:{type: String, required:true},
    password:{type: String, required:true}
})
export interface FacultyDoc extends Document
{
    initial:String,
    designation:String,
    fname:String,
    created_at: Date,
    updated_at: Date,
    type: String,
    phno:String,
    email: String,
    department: String,
    password: string,
}

export default model<FacultyDoc>("Faculty",FacultySchema)