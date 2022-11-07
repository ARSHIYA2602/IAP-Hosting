import { validationResult } from "express-validator"
import { url } from "inspector"
import Student from "../models/Student"
import Faculty from "../models/Faculty"
import Admin from "../models/Admin"
import User from "../models/Student"
import { NodeMailer } from "../utils/nodeMailer"
import jwt = require("jsonwebtoken")
import * as Bcrypt from "bcrypt"
import { response } from "express"
const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const json2xls = require('json2xls')
const JWTENCRYPTKEY="ASDASFDADSDAS"
const path=require("path")
const csvtojson = require('convert-csv-to-json');
import { basepath } from ".."
export class StudentController{
    static login(req,resp,next){
        const error=validationResult(req)
        const email=req.body.email
        const password=req.body.password
        if(!error.isEmpty()){
            const newError=new Error(error.array()[0].msg)
            next(newError)
            return;
        }
        const user= new User({
            email:email,
            password:password
        })
        user.save().then((user)=>{
            resp.send(user)
        }).catch(err=>{
            next(err)
        })
        /*const error= new Error("User doesn't exist");
        next(error);*/
    }

    static faclogin(req,resp,next){
        const error=validationResult(req)
        const email=req.body.email
        const password=req.body.password
        if(!error.isEmpty()){
            const newError=new Error(error.array()[0].msg)
            next(newError)
            return;
        }
        const user= new User({
            email:email,
            password:password
        })
        user.save().then((user)=>{
            resp.send(user)
        }).catch(err=>{
            next(err)
        })
        /*const error= new Error("User doesn't exist");
        next(error);*/
    }

    static signUp(req,resp,next){
        const error=validationResult(req)
        const email=req.body.email
        const password=req.body.password
        const sname=req.body.sname
        const rollno=req.body.rollno
        const cname=req.body.cname
        const ccity= req.body.ccity
        const branch=req.body.branch
        const phno= req.body.phno
        if(!error.isEmpty()){
            const newError=new Error(error.array()[0].msg)
            next(newError)
            return;
        }
        const token=jwt.sign({email,sname,password,rollno,cname,ccity,branch,phno},JWTENCRYPTKEY,{expiresIn:"20m"})
        const base="https://iapportal.herokuapp.com";
        NodeMailer.sendEmail({to:[email],subject:"Authenticate your account to complete Sign Up",html:`<p>Click below link to verify your account:<br><center><a href=${base}/verify?token=${token}>Verify</a></center><br>The above link is valid only for 20 minutes</p>`})
        resp.sendFile(basepath+"/StudentPanel/prompt3.html")
        /*const error= new Error("User doesn't exist");
        next(error);*/
    }
    static facsignUp(req,resp,next){
        const error=validationResult(req)
        //console.log(error)
        const email=req.body.email
        const password=req.body.password
        const fname=req.body.fname
        const initial=req.body.initial
        const designation=req.body.designation
        const department= req.body.department
        const phno= req.body.phno
        if(!error.isEmpty()){
            //console.log(error)
            const newError=new Error(error.array()[0].msg)
            next(newError)
            return;
        }
        const token=jwt.sign({email,fname,password,initial,designation,department,phno},JWTENCRYPTKEY,{expiresIn:"20m"})
        const base="https://iapportal.herokuapp.com";
        NodeMailer.sendEmail({to:[email],subject:"Authenticate your account to complete Sign Up",html:`<p>Click below link to verify your account:<br><center><a href=${base}/verify?token=${token}>Verify</a></center><br>The above link is valid only for 20 minutes</p>`})       
         resp.sendFile(basepath+"/StudentPanel/prompt3.html")
        /*const error= new Error("User doesn't exist");
        next(error);*/
    }
    static forgot(req,resp,next){
        const token=req.query.token
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
            Student.findOne({email:decoded.email,rollno:decoded.rollno}).then((user)=>{
                if(user){
                    resp.sendFile(`/getreset?${token}`)
                }
            })
        })        
    }
    static reset(req,resp,next){
        const token=req.body.tok
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
        const rollno=decoded.rollno
        const email=decoded.email
        const password=req.body.password
           Student.findOne({email:email,rollno:rollno},(err,user)=>{
               if(!user){
                   resp.send("Failure")
               }
               Bcrypt.hash(password,10,(err,hash)=>{
                if(err){
                    next(new Error("Hashing Failed"))
                }
                user.password=hash
                user.save() 
            })
                resp.sendFile(basepath+`/StudentPanel/forgotprompt2.html`)

           })
        })
    }

    static facreset(req,resp,next){
        const token=req.body.tok
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
        const email=decoded.email
        const password=req.body.password
           Faculty.findOne({email:email},(err,user)=>{
               if(!user){
                   resp.send("Failure")
               }
               Bcrypt.hash(password,10,(err,hash)=>{
                if(err){
                    next(new Error("Hashing Failed"))
                }
                user.password=hash
                user.save() 
            })
                resp.sendFile(basepath+`/StudentPanel/forgotprompt2.html`)

           })
        })
    }

    static verify(req,resp,next){
        const token=req.query.token
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
            Bcrypt.hash(decoded.password,10,(err,hash)=>{
                if(err){
                    next(new Error("Hashing Failed"))
                }
                console.log("Verified")
                const stu= new Student({
                    email:decoded.email,
                    password:hash,
                    sname:decoded.sname,
                    cname:decoded.cname,
                    ccity:decoded.ccity,
                    branch:decoded.branch,
                    phno:decoded.phno,
                    rollno:decoded.rollno,
                    type: 'student',
                    trainLetter:"",
                    Fee:"",
                    MidWayReport:"",
                    ReportFile:"",
                    GoalReport:"",
                    ProjectPPT:"",
                    FinalLetter:"",
                    Arranged_by:"",
                    Mentor_name:"",
                    Mentor_Contact:"",
                    Mentor_email:"",
                    Stipend:"",
                    Cphno:"",
                    Country:"",
                    Address:"",
                    facassigned:"",
                    A1:"",
                    A2:"",
                    A3:"",
                    B1:"",
                    B2:"",
                    B3:"",
                    C1:"",
                    C2:"",
                    C3:"",
                    D1:"",
                    D2:"",
                    D3:"",
                    D4:"",
                    E1:"",
                    E2:"",
                    E3:"",
                    initTrainLetterEnable:false,
                    goalReportEnable:false,
                    midWayReportEnable:false,
                    projectReportEnable:false,
                    projectPPTEnable:false,
                    finalTrainLetterEnable:false
                })
                stu.save().then((stu)=>{
                    
                    resp.sendFile(basepath+"/StudentPanel/StudentLogin.html")
                }).catch(err=>{
                    next(err)
                })

            })
            
        })
    }

    static facverify(req,resp,next){
        const token=req.query.token
        jwt.verify(token,JWTENCRYPTKEY,function(err,decoded){
            if(err){
                next(new Error("Incorrect or Expired Token"))
            }
            Bcrypt.hash(decoded.password,10,(err,hash)=>{
                if(err){
                    next(new Error("Hashing Failed"))
                }
                const fac= new Faculty({
                    email:decoded.email,
                    password:hash,
                    fname:decoded.fname,
                    designation:decoded.designation,
                    department:decoded.department,
                    initial:decoded.initial,
                    phno:decoded.phno,
                    type: 'faculty'   
                })
                fac.save().then((stu)=>{    
                    resp.sendFile(basepath+"/FacultyPanel/facultyLogin.html")
                }).catch(err=>{
                    next(err)
                })

            })
            
        })
    }

    static Check(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect("/studentlogin")
    }
    static notCheck(req,res,next){
        if(!req.isAuthenticated()){
            return next()       
        }
        res.redirect("/home2")
    }
    static facnotCheck(req,res,next){
        if(!req.isAuthenticated()){
            return next()       
        }
    
        // Student.find({}, function (err, allDetails) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         res.render("index", { details: allDetails })
        //     }
        // })
        res.redirect("/tagged_students")
    }
    static facCheck(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect("/facultyLogin")
    }
    static adminCheck(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect("/adminLogin")
    }
    static adminNotCheck(req,res,next){
        if(!req.isAuthenticated()){
            return next()       
        }
        res.redirect("/findStudent")
    }

    static freeze_unfreezePage(req,res,next){
        Student.find({rollno:"101903116"},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                // console.log(result[0].initTrainLetterEnable)
                var fileCheck={
                    initLetterEnable:result[0].initTrainLetterEnable,
                    goalReportEnable:result[0].goalReportEnable,
                    midWayReportEnable:result[0].midWayReportEnable,
                    projectReportEnable:result[0].projectReportEnable,
                    projectPPTEnable:result[0].projectPPTEnable,
                    finLetterEnable:result[0].finalTrainLetterEnable
                }
                // console.log(fileCheck)
                res.render(basepath+"/AdminPanel/enableDocs.html",fileCheck)
            }
        })
    }

    static freeze_unfreeze(req,res,next){
        const initTrain = req.body.initTrain == "disable" ? false :true
        const goalReport = req.body.goalReport == "disable" ? false :true
        const midWayReport = req.body.midWayReport == "disable" ? false :true
        const projectReport = req.body.projectReport == "disable" ? false :true
        const projectPPT = req.body.projectPPT == "disable" ? false :true
        const finalTrain = req.body.finalTrainLetter == "disable" ? false :true
        Student.updateMany({},{$set:{initTrainLetterEnable:initTrain,goalReportEnable:goalReport,midWayReportEnable:midWayReport,projectReportEnable:projectReport,projectPPTEnable:projectPPT,finalTrainLetterEnable:finalTrain}},(err,result)=>{
            if(err){
                return next(new Error(err))
            }else{
                // console.log("Updated")
                res.redirect("/freeze_unfreeze")
            }
        })
    }

    static phase2upload(req,res,next){
        Student.find({rollno:req.user.rollno},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                var fileCheck={
                    stat:true,
                    initletter:true,
                    goalrep:true,
                    midway:true,
                    projppt:true,
                    repfile:true,
                    finletter:true,
                    stat1:false,
                    initLetterEnable:result[0].initTrainLetterEnable,
                    goalReportEnable:result[0].goalReportEnable,
                    midWayReportEnable:result[0].midWayReportEnable,
                    projectReportEnable:result[0].projectReportEnable,
                    projectPPTEnable:result[0].projectPPTEnable,
                    finLetterEnable:result[0].finalTrainLetterEnable
                }
                //console.log(req.user)
                if(req.user.stipend==''){
                    fileCheck.stat=false
                }
                else {
                    console.log(req.user.stipend)
                }
                if(req.user.GoalReport==""){
                    fileCheck.goalrep=false
                }
                
                if(req.user.MidWayReport==''){
                    fileCheck.midway=false
                }
                if(req.user.ReportFile==''){
                    fileCheck.repfile=false
                }
                if(req.user.ProjectPPT==''){
                    fileCheck.projppt=false
                }
                if(req.user.FinalLetter==''){
                    fileCheck.finletter=false
                }
                if(req.user.Mentor_name!=""){
                    fileCheck.stat1=true
                }
                res.render(basepath+"/StudentPanel/phase2-uploads.html",fileCheck)
            }
        })
        
        
    }
    static facassigned(req,res,next){
        if(req.user.facassigned!=""){

        res.render(basepath+"/StudentPanel/phase2-faculty.html",{stat1:true,facname:req.user.facassigned})}
        else{
            //console.log(req.user)
            res.render(basepath+"/StudentPanel/phase2-faculty.html",{stat1:false,facname:""})
        }
    }
    static home(req,res,next){
        //res.sendFile(basepath+"/MainPage/FirstPage.html")
        res.sendFile(basepath+`/MainPage/FirstPage.html`)

    }

    static admin(req,res,next){
        res.sendFile(basepath+"/AdminPanel/adminLogin.html")
    }

    static studentpanel(req,res,next){
        res.sendFile(basepath+"/StudentPanel/StudentLogin.html")
    }
    static facultypanel(req,res,next){
        res.sendFile(basepath+"/FacultyPanel/facultyLogin.html")
    }
    static adminpanel(req,res,next){
        res.sendFile(basepath+"/MainPage/FirstPage.html")
    }
    static sturegister(req,res,next){
        res.sendFile(basepath+"/StudentPanel/Register.html")
    }
    static facregister(req,res,next){
        res.sendFile(basepath+"/FacultyPanel/FacultyRegister.html")
    }
    static chpwd(req,res,next){
        res.render(basepath+"/StudentPanel/phase2-password.html",{passmatch:0})
    }
    
    static getreset(req,resp,next){
        const token=req.query.token
        resp.render(basepath+`/StudentPanel/reset.html`,{tok:token})
    }

    static facgetreset(req,resp,next){
        const token=req.query.token
        resp.render(basepath+`/FacultyPanel/reset.html`,{tok:token})
    }

    static tagged_students(req,res,next){
        const email = req.user.email
        //console.log(fname)
        // var query = {facassigned:"Vinay Arora"}
        Student.find({facassigned:email},(err, result)=>{
            if (err) {
                console.log(err);
            } else {
                let csv
                let fields = ["rollno","branch","sname","phno","email","cname","ccity","Address","Arranged_by","Country","Mentor_Contact","Mentor_Email","Mentor_name","Stipend","facassigned"]
                csv = json2csv(result, { fields });
                
                const dateTime = moment().format('YYYYMMDDhhmmss');
                const filePath = path.join(__dirname,"files", req.user.email, "csv-" + dateTime + ".csv")
                fs.mkdir(path.dirname(filePath),{recursive:true},(err)=>{
                    fs.writeFile(filePath, csv, function (err) {
                        if (err) {
                          res.json(err).status(500);
                        }
                        else {
                          setTimeout(function () {
                            fs.unlinkSync(filePath); // delete this file after 30 seconds
                          }, 40000)
                          let csvdat= `/${req.user.email}/csv-${dateTime}.csv`
                          res.render(basepath+"/FacultyPanel/tagged_students.ejs", { details: result ,csvdat:csvdat})
                        }
                      });
                })
                //console.log(result)
                
            }
        })
        // res.sendFile(basepath+"/FacultyPanel/tagged_students.html")
    }

    static display(req, res, next){
        var id = req.body.view
        // console.log(req.body.name)
        Student.find({_id:id},(err,result)=>{
            if (err) {
                console.log(err);
            } else {
                // console.log(result)
                res.render(basepath+"/FacultyPanel/display.ejs", { details: result })
            }
        })
    }

    static AdminVerify(req, res, next){
        const rollno = req.body.rollno
        Student.updateOne({rollno:rollno},{$set:{verified:true}},(err,result)=>{
            if (err) {
                console.log(err);
            } else {
                // console.log(result)
                res.render(basepath+"/AdminPanel/findStudent.html")
            }
        })
    }

    static findStudent(req,res,next){
        var id = req.body.rollno
        // console.log(req.body.name)
        Student.find({rollno:id},(err,result)=>{
            if (err) {
                console.log(err);
            } else {
                if(result==null){
                    res.render(basepath+"/AdminPanel/findStudent.html")
                } else{
                // console.log(result)
                res.render(basepath+"/AdminPanel/Admin_VerifyStudent.ejs",{details:result})
                }
            }
        })
    }
    static findStudentPage(req,res,next){
        res.sendFile(basepath+"/AdminPanel/findStudent.html")
    }
    static getfeedback(req,res,next){
        var data={
            stipend:req.user.Stipend,
            A1:req.user.A1,
            A2:req.user.A2,
            A3:req.user.A3,
            B1:req.user.B1,
            B2:req.user.B2,
            B3:req.user.B3,
            C1:req.user.C1,
            C2:req.user.C2,
            C3:req.user.C3, 
            A1fac:req.user.A1fac,
            A2fac:req.user.A2fac,    
            A3fac:req.user.A3fac,
            B1fac:req.user.B1fac,
            B2fac:req.user.B2fac,
            B3fac:req.user.B3fac,
            C1fac:req.user.C1fac,
            C2fac:req.user.C2fac,
            C3fac:req.user.C3fac, 
        }
        res.render(basepath+"/StudentPanel/demo.html",data)
        
    }
    static getfacfeedback(req,res,next){
        console.log(req.body.sub)
        Student.findOne({_id:req.body.sub},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                // console.log(result)
                // console.log(result.A1)
                var data={
                    A1fac:result.A1fac,
                    A2fac:result.A2fac,
                    A3fac:result.A3fac,
                    B1fac:result.B1fac,
                    B2fac:result.B2fac,
                    B3fac:result.B3fac,
                    C1fac:result.C1fac,
                    C2fac:result.C2fac,
                    C3fac:result.C3fac, 
                    A1stu:result.A1,
                    A2stu:result.A2,
                    A3stu:result.A3,
                    B1stu:result.B1,
                    B2stu:result.B2,
                    B3stu:result.B3,
                    C1stu:result.C1,
                    C2stu:result.C2,
                    C3stu:result.C3, 
                    stipend:result.stipend,
                    idstu:result._id   
                }
                // console.log(data)
                res.render(basepath+"/FacultyPanel/demo.html",data)
            }
        }) 
        
    }
    
    static stforget(req,resp,next){
        resp.sendFile(basepath+"/StudentPanel/Forgot.html")
    }
    static facforget(req,resp,next){
        resp.sendFile(basepath+"/FacultyPanel/Forgot.html")
    }
    static stuforget(req,res,next){
        const rollno=req.body.rollno;
        Student.findOne({rollno:rollno}).then(user=>{
            if(user){
                const email=user.email;
                const token=jwt.sign({email,rollno},JWTENCRYPTKEY,{expiresIn:"20m"})
                const base="https://iapportal.herokuapp.com";
                NodeMailer.sendEmail({to:[String(email)],subject:"Reset Password",html:`<p>Click below link to reset your password:<br><center><a href=${base}/getreset?token=${token}>Reset</a></center><br>The above link is valid only for 20 minutes</p>`})
                res.sendFile(basepath+"/StudentPanel/forgotprompt1.html")
            }else{
                throw new Error("Something went Wrong")
            }
        })
    }
    static facultyforget(req,res,next){
        const email=req.body.email;
        Faculty.findOne({email:email}).then(user=>{
            if(user){
                const email=user.email;
                const token=jwt.sign({email},JWTENCRYPTKEY,{expiresIn:"20m"})
                const base="https://iapportal.herokuapp.com";
                NodeMailer.sendEmail({to:[String(email)],subject:"Reset Password",html:`<p>Click below link to reset your password:<br><center><a href=${base}/facgetreset?token=${token}>Reset</a></center><br>The above link is valid only for 20 minutes</p>`})
                res.sendFile(basepath+"/StudentPanel/forgotprompt1.html")
            }else{
                throw new Error("Something went Wrong")
            }
        })
    }
    static default(req,res,next){  
        res.sendFile(basepath+"/StudentPanel/Student2.html")
    }
    static facdefault(req,res,next){  
        res.sendFile(basepath+"/FacultyPanel/Faculty2.html")
    }
    static admindefault(req,res,next){ 
        res.sendFile(basepath+"/AdminPanel/Admin2.html")
    }
    static facfeedbackup(req,res,next){
        Student.findOne({_id:req.body.sub}).then((user)=>{
            // console.log(user)
            user.A1fac=req.body.A1ParameterByFaculty
            user.A2fac=req.body.A2ParameterByFaculty
            user.A3fac=req.body.A3ParameterByFaculty
            user.B1fac=req.body.B1ParameterByFaculty
            user.B2fac=req.body.B2ParameterByFaculty
            user.B3fac=req.body.B3ParameterByFaculty
            user.C1fac=req.body.C1ParameterByFaculty
            user.C2fac=req.body.C2ParameterByFaculty
            user.C3fac=req.body.C3ParameterByFaculty
            
            user.save().then(()=>{
                // res.redirect("/getfacfeedback")
                next();
            })
            // res.redirect("/getfacfeedback")
        })
    }
    static async home2(req,res,next){
        if(req.user.verified!=true){
            var fileCheck
            if(req.user.trainLetter=="" && req.user.Fee=="" )
            {
                fileCheck={trainLetter:false,Fee:false}
            }
            else if(req.user.trainLetter!="" && req.user.Fee=="" )
            {
                fileCheck={trainLetter:true,Fee:false}
            }
            else if(req.user.trainLetter=="" && req.user.Fee!="" )
            {
                fileCheck={trainLetter:false,Fee:true}
            }
            else if(req.user.trainLetter!="" && req.user.Fee!="" )
            {
                fileCheck={trainLetter:true,Fee:true}
            }
            res.render(basepath+"/StudentPanel/Page1.html",fileCheck)
        }
    
        else if(req.user.Stipend=='') {

                res.render(basepath+"/StudentPanel/phase2.html",{stat1:false,facname:""}) 

        }
        else {
            res.render(basepath+"/StudentPanel/phase2-faculty.html",{stat1:true,facname:req.user.facassigned}) 

        }
    }
    static feedbackup(req,res,next){
        Student.findOne({rollno:req.user.rollno}).then((user)=>{
            user.A1=req.body.A1ParameterByStudent
            user.A2=req.body.A2ParameterByStudent
            user.A3=req.body.A3ParameterByStudent
            user.B1=req.body.B1ParameterByStudent
            user.B2=req.body.B2ParameterByStudent
            user.B3=req.body.B3ParameterByStudent
            user.C1=req.body.C1ParameterByStudent
            user.C2=req.body.C2ParameterByStudent
            user.C3=req.body.C3ParameterByStudent
            
            user.save().then(()=>{
                res.redirect("/feedback")
            })
        })
    }
    static upload1(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
          }
          const allowedExtension = ['.pdf'];
          
        
          const file = req.files.trainLetter;
          const path1 = __dirname + "/files/trainLetter/" +req.user.rollno+"/"+ file.name;
          const extensionName = path.extname(file.name); //
          if(!allowedExtension.includes(extensionName)){
              return resp.status(422).send("Invalid File Extension");
          }
          file.mv(path1, (err) => {
            if (err) {
              return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.trainLetter="/trainLetter/" +req.user.rollno+"/"+ file.name;
                user.save().then(function(){
                    resp.redirect("/home2")
                })
            })
            
          });
    }
    static upload2(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
          }
          const allowedExtension = ['.pdf'];
          
        
          const file = req.files.fee;
          const path1 = __dirname + "/files/Fee/" +req.user.rollno+"/"+ file.name;
          const extensionName = path.extname(file.name); //

          if(!allowedExtension.includes(extensionName)){
              return resp.status(422).send("Invalid File Extension");
          }
          file.mv(path1, (err) => {
            if (err) {
              return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.Fee="/Fee/" +req.user.rollno+"/"+ file.name;
                user.save().then(function (){
                    resp.redirect("/home2")
                })
                
            })
          });
    }
    static info(req,resp,next){
        const arrange=req.body.arrange;
        const mentor=req.body.mentor;
        const memail=req.body.memail;
        const stipend=req.body.stipend;
        const mphno=req.body.mphno;
        const sno=req.body.sno;
        const city=req.body.city1;
        const country=req.body.country;
        const ccountry=req.body.ccountry;
        const compaddr=req.body.compaddr.concat(" ",req.body.landmark);
        Student.findOne({rollno:req.user.rollno}).then(user=>{
            user.Arranged_by=arrange;
            user.Mentor_name=mentor;
            user.Mentor_email=memail;
            user.Stipend=stipend;
            user.Mentor_Contact=mphno;
            user.ccity=city;
            user.Address=compaddr;
            if(user.phno!=sno){
                user.phno=sno;
            }
            if(country=="India"){
                user.Country=country;
            }
            else{
                user.Country=ccountry;
            }
            user.save().then(()=>{
                resp.render(basepath+"/StudentPanel/phase2-faculty.html",{stat1:true,facname:req.user.facassigned})
            });
        })
    }
    static async passupdate(req,resp,next){
        const oldpass=req.body.oldpassword;
        const newpass=req.body.password;
        const cpass=req.body.password2;
        if(await Bcrypt.compare(oldpass,req.user.password)){
            Student.findOne({rollno:req.user.rollno}).then((user)=>{
                Bcrypt.hash(newpass,10,(err,hash)=>{
                    if(err){
                        next(new Error("Hashing Failed"))
                    }
                    user.password=hash;
                    user.save().then(()=>{
                        resp.render(basepath+"/StudentPanel/phase2-password.html",{passmatch:1})
                    })
                })
            })
        }
        else{
            resp.render(basepath+"/StudentPanel/phase2-password.html",{passmatch:2})
        }
    }
    static uploads_goalrep(req,resp,next){
    if (!req.files) {
        return resp.status(400).send("No files were uploaded.");
      }
      const allowedExtension = ['.pdf'];
      
    
      const file = req.files.goalReport;
      const path1 = __dirname + "/files/Goal_Report/" +req.user.rollno+"/"+ file.name;
      const extensionName = path.extname(file.name); //

      if(!allowedExtension.includes(extensionName)){
          return resp.status(422).send("Invalid File Extension");
      }
      file.mv(path1, (err) => {
        if (err) {
          return resp.status(500).send(err);
        }
        Student.findOne({rollno:req.user.rollno}).then(user=>{
            user.GoalReport="/Goal_Report/" +req.user.rollno+"/"+ file.name;
            user.save().then(function (){
                resp.redirect("/uploads")
            })
            
        })
      });
    }
    static uploads_midway(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
        }
        const allowedExtension = ['.pdf'];
        
        
        const file = req.files.midWayReport;
        const path1 = __dirname + "/files/Mid_Way_Report/" +req.user.rollno+"/"+ file.name;
        const extensionName = path.extname(file.name); //

        if(!allowedExtension.includes(extensionName)){
            return resp.status(422).send("Invalid File Extension");
        }
        file.mv(path1, (err) => {
            if (err) {
            return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.MidWayReport="/Mid_Way_Report/" +req.user.rollno+"/"+ file.name;
                user.save().then(function (){
                    resp.redirect("/uploads")
                })
                
            })
        });
    }
    static uploads_repfile(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
        }
        const allowedExtension = ['.pdf'];
        
        
        const file = req.files.reportFile;
        const path1 = __dirname + "/files/Report_File/" +req.user.rollno+"/"+ file.name;
        const extensionName = path.extname(file.name); //

        if(!allowedExtension.includes(extensionName)){
            return resp.status(422).send("Invalid File Extension");
        }
        file.mv(path1, (err) => {
            if (err) {
            return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.ReportFile="/Report_File/" +req.user.rollno+"/"+ file.name;
                user.save().then(function (){
                    resp.redirect("/uploads")
                })
                
            })
        });
    }    
    static uploads_projppt(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
        }
        const allowedExtension = ['.ppt','.pptx'];
        
        
        const file = req.files.projectPPT;
        const path1 = __dirname + "/files/Project_PPT/" +req.user.rollno+"/"+ file.name;
        const extensionName = path.extname(file.name); //

        if(!allowedExtension.includes(extensionName)){
            return resp.status(422).send("Invalid File Extension");
        }
        file.mv(path1, (err) => {
            if (err) {
            return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.ProjectPPT="/Project_PPT/" +req.user.rollno+"/"+ file.name;
                user.save().then(function (){
                    resp.redirect("/uploads")
                })
                
            })
        });
    } 
    static uploads_finletter(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
        }
        const allowedExtension = ['.pdf'];
        
        
        const file = req.files.finalLetter;
        const path1 = __dirname + "/files/Final_Training_Letter/" +req.user.rollno+"/"+ file.name;
        const extensionName = path.extname(file.name); //

        if(!allowedExtension.includes(extensionName)){
            return resp.status(422).send("Invalid File Extension");
        }
        file.mv(path1, (err) => {
            if (err) {
            return resp.status(500).send(err);
            }
            Student.findOne({rollno:req.user.rollno}).then(user=>{
                user.FinalLetter="/Final_Training_Letter/" +req.user.rollno+"/"+ file.name;
                user.save().then(function (){
                    resp.redirect("/uploads")
                })
                
            })
        });
    }   
    static removeLetter(req,res,next){
        Student.findOne({rollno:req.body.rollno},(err,user)=>{
           // console.log(user)
            let tr=user.trainLetter
            //console.log(__dirname+"/files"+tr)
            user.trainLetter=""
            user.verified=false
            fs.unlinkSync(__dirname+"/files"+tr)
            user.save().then(()=>{
                NodeMailer.sendEmail({to:[user.email],subject:"Error while Student Verification",html:`<p>This is to inform you that the Training Letter provided by you during the verification process at IAP Portal has been disproved. Kindly contact the IAP Coordinator and upload it again<br>Regards<br>IAP CELL</p>`})
                res.redirect("/findStudent")
            })
            
        })
    }
    static removeFee(req,res,next){
        Student.findOne({rollno:req.body.rollno},(err,user)=>{
            //console.log(user)
            let tr=user.Fee
            //console.log(__dirname+"/files"+tr)
            user.Fee=""
            user.verified=false
            fs.unlinkSync(__dirname+"/files"+tr)
            user.save().then(()=>{
                NodeMailer.sendEmail({to:[user.email],subject:"Error while Student Verification",html:`<p>This is to inform you that the Fee Receipt provided by you during the verification process at IAP Portal has been disproved. Kindly contact the IAP Coordinator and upload it again<br><br>Regards<br>IAP CELL</p>`})
                res.redirect("/findStudent")
            })
            
        })
    }
    static getDelStudent(req,res,next){
        res.sendFile(basepath+"/AdminPanel/delStudentView.html")
    }
    static delStudent(req,res,next){
        var id = req.body.rollno
        // console.log(req.body.name)
        Student.find({rollno:id},(err,result)=>{
            if (err) {
                console.log(err);
            } else {
                // console.log(result)
                if(result==null){
                    res.render(basepath+"/AdminPanel/delStudentView.html")
                } else {
                res.render(basepath+"/AdminPanel/Admin_Delete.ejs",{details:result})
                }
            }
        })
    }
    static adminDelete(req,res,next){
        Student.deleteOne({rollno:req.body.rollno},(result)=>{
            res.redirect("/delStudent")    
        })
    }
    static genExcel(req,res,next){
        //console.log(fname)
        // var query = {facassigned:"Vinay Arora"}
        Student.find({},(err, result)=>{
            if (err) {
                console.log(err);
            } else {
                let csv
                let fields = ["rollno","branch","sname","phno","email","cname","ccity","Address","Arranged_by","Country","Mentor_Contact","Mentor_Email","Mentor_name","Stipend","facassigned"]
                csv = json2xls(result, { fields:fields });
                
                const dateTime = moment().format('YYYYMMDDhhmmss');
                const filePath = path.join(__dirname,"files", "admin", "xlsx-" + dateTime + ".xlsx")
                fs.mkdir(path.dirname(filePath),{recursive:true},(err)=>{
                    fs.writeFile(filePath, csv,'binary', function (err) {
                        if (err) {
                        res.json(err).status(500);
                        }
                        else {
                        setTimeout(function () {
                            fs.unlinkSync(filePath); 
                        }, 40000)
                        let csvdat= `/admin/xlsx-${dateTime}.xlsx`
                        res.redirect(csvdat)
                        }
                    });
                })
                //console.log(result)
                
            }
        })
        // res.sendFile(basepath+"/FacultyPanel/tagged_students.html")
    }
    static getuploadcsv(req,res,next){
        res.sendFile(basepath+"/AdminPanel/uploadcsv.html")
    }
    static  uploadcsv(req,resp,next){
        if (!req.files) {
            return resp.status(400).send("No files were uploaded.");
        }
        const allowedExtension = ['.csv'];
        
        
        const file = req.files.csv;
        const path1 = __dirname + "/files/csvuploads/"+ file.name;
        const extensionName = path.extname(file.name); //

        if(!allowedExtension.includes(extensionName)){
            return resp.status(422).send("Invalid File Extension");
        }
         file.mv(path1,async (err) => {
            if (err) {
            return resp.status(500).send(err);
            }
            let json = csvtojson.fieldDelimiter(',').getJsonFromCsv(path1);
            let bulk_arr = [];
               json.forEach(json1=>{
                    let op={ updateOne :{"filter": {"rollno":json1.rollno},update:{facassigned:json1.facassigned}}}
                    bulk_arr.push(op)
            })
            //console.log(bulk_arr)
            Student.bulkWrite(bulk_arr)
            fs.unlinkSync(path1)
            const s= await Student.findOne({})
            resp.redirect("/getcsv")
        });
    } 
    static changeTaggingPage(req,res,next){
        res.sendFile(basepath+"/AdminPanel/changeTagging.html")
    }

    static changeTagging(req,res,next){
        const rollno = req.body.rollno
        const email = req.body.email
        Student.updateOne({rollno:rollno},{$set:{facassigned:email}},(err,result)=>{
            if (err) {
                console.log(err);
            } else {
                res.sendFile(basepath+"/AdminPanel/changeTagging.html")
            }
        })
    }  
}

