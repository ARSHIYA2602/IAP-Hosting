import { Server } from "./server";
const express=require("express")
import { getEnvironmentVars } from "./environments/env";
import * as flash from "express-flash"
import * as session from "express-session"
export var basepath=process.cwd(); 
const port = 5000;
let server=new Server().app;
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');
server.set('views', __dirname);
server.use(express.static(basepath+"/static"))
server.use(express.static(basepath+"/src/controllers/files"))
server.listen(process.env.PORT || 5000, () =>{
    console.log(`Server running on port ${port}`);
});



