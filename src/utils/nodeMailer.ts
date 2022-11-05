import { createReadStream } from "fs";
import { creds } from "../environments/env";
const nodemailer = require('nodemailer');
export class NodeMailer{
    
    
    static sendEmail(data:{to:[string],subject:string,html:string}):Promise<any>{
         const transport= nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: creds()
         });;
       return transport.sendMail({from:"jasy94170@gmail.com",to:data.to,subject:data.subject,html:data.html});
    }
}