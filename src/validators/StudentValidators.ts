import bodyParser = require("body-parser");
import { body } from "express-validator";
import Student from "../models/Student";
import Faculty from "../models/Faculty";

export class StudentValidators{
    static login(){
        return [body('rollno','Roll Number Invalid').isString().isLength({min:9,max:9}),
        body('password').custom((req)=>{
            if((req.password).length>8){
                return true
            }else{
                throw new Error("Password Invalid")
            }
        })]
    }

    static faclogin(){
        return [body('email','Email Invalid').isString().isLength({min:30,max:30}),
        body('password').custom((req)=>{
            if((req.password).length>8){
                return true
            }else{
                throw new Error("Password Invalid")
            }
        })]
    }

    static signUp(){
        return [body('sname','Student Name Invalid').isString(),
        body('cname','Company Name Invalid').isString(),
        body('ccity','Company City Invalid').isString(),
        body('branch','Branch Invalid').isString(),
        body('phno','Phone Number Invalid').isMobilePhone("en-IN").custom((phno,{req})=>{
            return Student.findOne({phno:phno}).then(user=>{
                if(user){
                    throw new Error("Student already exists")
                }else{
                    return true
                }
            })
        }),
        body('email',"Email Required").isEmail().custom((email,{req})=>{
            return Student.findOne({email:email}).then(user=>{
                if(user){
                    throw new Error("Student already exists")
                }else{
                    return true
                }
            })
            
        }),
        body('rollno'," Required").isNumeric().custom((rollno,{req})=>{
            return Student.findOne({rollno:rollno}).then(user=>{
                if(user){
                    console.log(user)
                    throw new Error("Student already exists")
                }else{
                    return true
                }
            })
            
        }),
        body('password',"Password Required").isAlphanumeric().isLength({min:8,max:20}).withMessage("Password must be Betwwen 8-20 characters"),
        body('rollno',"Roll Number Required").isNumeric().isLength({min:9,max:9}).withMessage("Roll Number must be of 9 digits")
    ]
    
    }

    static facsignUp(){
        return [body('initial','initial Invalid').isString(),
        body('designation','designation Invalid').isString(),
        body('department','department Invalid').isString(),
        body('fname','Name Invalid').isString(),
        body('phno','Phone Number Invalid').isMobilePhone("en-IN").custom((phno,{req})=>{
            return Faculty.findOne({phno:phno}).then(user=>{
                if(user){
                    throw new Error("Faculty already exists")
                }else{
                    return true
                }
            })
        }),
        body('email',"Email Required").isEmail().custom((email,{req})=>{
            return Faculty.findOne({email:email}).then(user=>{
                if(user){
                    throw new Error("Faculty already exists")
                }else{
                    return true
                }
            })
            
        }),
        body('password',"Password Required").isAlphanumeric().isLength({min:8,max:20}).withMessage("Password must be Betwwen 8-20 characters")
    ]
    
    }
    
}