import Student from "../models/Student"
import Faculty from "../models/Faculty"
import Admin from "../models/Admin"
import * as Bcrypt from "bcrypt"
import { nextTick } from "process"
const LocalStrategy=require("passport-local").Strategy

function initialize(passport){
    const authenticateStudent= async (rollno,password,done)=>{
        const student= await Student.findOne({rollno:rollno})
              try{
                if(student==null){
                    return done(null,false,{message:"Password Incorrect"})
                }
                else if( await Bcrypt.compare(password,student.password)){
                    return done(null,student)
                }
                else{
                    return done(null,false,{message:"Password Incorrect"})
                }
            }
            catch(e){
                return done(e)
            
        }
    }
    const authenticateFaculty= async (email,password,done)=>{
        const faculty= await Faculty.findOne({email:email})
        try{
            if(faculty==null){
                return done(null,false,{message:"Password Incorrect"})
            }
            else if( await Bcrypt.compare(password,faculty.password)){
                    return done(null,faculty)
                }
                else{
                    return done(null,false,{message:"Password Incorrect"})
                }
            }
            catch(e){
                return done(e)
            
        }
    }
    const authenticateAdmin= async (uname,password,done)=>{
        // console.log(uname)
        // console.log(password)
         Admin.findOne({uname:uname},(err,admin)=>{
                if(err){
                    return done(err)
                }
                //console.log(typeof admin.password)
                 //console.log(password)
                if(admin==null){
                    return done(null,false,{message:"Password Incorrect"})
                }
                else if(password == admin.password){
                    return done(null,admin)
                }
                else{
                    console.log("error")
                    return done(null,false,{message:"Password Incorrect"})
                }
                
        
         })
              
    }

    passport.use('student', new LocalStrategy({usernameField:"rollno"},authenticateStudent))
    passport.use('faculty', new LocalStrategy({usernameField:"email"},authenticateFaculty))
    passport.use('admin', new LocalStrategy({usernameField:"uname"},authenticateAdmin))
    //passport.serializeUser((entity,done)=>done(null,entity.type))
    passport.serializeUser(function (entity, done) {
        done(null, { id: entity.id, type: entity.type });
    });
    // passport.deserializeUser((id,done)=>{ Student.findOne({rollno:id},(err,user)=>{
    //     done(err,user);
    // })})
    passport.deserializeUser(function (obj, done) {
        switch (obj.type) {
            case 'student':
                Student.findById(obj.id)
                    .then(user => {
                        if (user) {
                            done(null, user);
                        }
                        else {
                            done(new Error('user id not found:' + obj.id));
                        }
                    });
                break;
            case 'faculty':
                Faculty.findById(obj.id)
                    .then(device => {
                        if (device) {
                            done(null, device);
                        } else {
                            done(new Error('device id not found:' + obj.id));
                        }
                    });
                break;
            case 'admin':
                Admin.findById(obj.id)
                    .then(device =>{
                        if(device){
                            done(null,device);
                        }else{
                            done(new Error('device id not found:' +obj.id));
                        }
                    })
                    break;
            default:
                done(new Error('no entity type:'), null);
                break;
        }
    });
}
module.exports=initialize