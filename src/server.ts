import bodyParser = require('body-parser');
import express = require('express')
import mongoose = require('mongoose')
import { getEnvironmentVars } from './environments/env';
import StudentRouter from './router/StudentRouter';
import * as passport from "passport"
import * as flash from "express-flash"
import * as session from "express-session"
const MY_SECRET_KEY="qazwsxedcrfvtgbyhnujmiklop"
const fileUpload = require("express-fileupload");

export class Server{
    public app = express()

    constructor(){
        this.setConfiguration();
        this.setRoutes();
        this.errorHandler();
    }
    setConfiguration(){
        this.setMongoDB()
        this.setBodyParser()
        this.setPassport()
        this.setFiles()
    }
    setMongoDB(){
        mongoose.connect(getEnvironmentVars().db_url).then(
            ()=>{
                console.log("MongoDB started");
            });
    }
    setBodyParser(){
        this.app.use(bodyParser.urlencoded({extended: true})) // false: querystring , true: qs library
    }
    setFiles(){

        this.app.use(fileUpload(
            {
                createParentPath: true,
                limits: { fileSize: 10 * 1024 * 1024 },
                abortOnLimit: true

            }
        ))
    }
    setPassport(){
        const initializePassport=require("./utils/passport-strategy")
        initializePassport(passport)
        this.app.use(flash())
        this.app.use(session({
            secret:MY_SECRET_KEY,
            resave:false,
            saveUninitialized:false
        }))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
    }
    setRoutes(){
        this.app.use(StudentRouter);
    }
    errorHandler(){
        this.app.use((error,req,resp,next)=>{
            const ErrorStatus=req.ErrorStatus || 500;
            resp.status(ErrorStatus).json({
                message:error.message || "Something Went Wrong",
                status_code: ErrorStatus
            })
        });
    }
}
