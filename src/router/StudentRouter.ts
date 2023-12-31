import { Router } from "express";
import passport = require("passport");
import { StudentController } from "../controllers/StudentControllers";
import { StudentValidators } from "../validators/StudentValidators";
// import {FacultyController} from "../controllers/FacultyController";

class StudentRouter{
    public Router:Router;

    constructor(){
        this.Router=Router()
        this.getRoutes();
        this.patchRoutes();
        this.postRoutes();
        this.deleteRoutes();
    }
    getRoutes(){
        this.Router.get("/verify",StudentController.verify)
        this.Router.get("/facverify",StudentController.facverify)
        this.Router.get("/",StudentController.home)
        this.Router.get("/login",StudentController.default)
        this.Router.get("/faclogin",StudentController.facdefault)
        this.Router.get("/adminLogin",StudentController.admindefault)
        this.Router.get("/studentLogin",StudentController.studentpanel)
        this.Router.get("/mentorLogin",StudentController.mentorpanel)
        this.Router.get("/sturegister",StudentController.sturegister)
        this.Router.get("/stuforget",StudentController.stforget)
        this.Router.get("/facultyforget",StudentController.facforget)
        this.Router.get("/home2",StudentController.Check,StudentController.home2)
        this.Router.get("/chpwd",StudentController.Check,StudentController.chpwd)
        this.Router.get("/getreset",StudentController.getreset)
        this.Router.get("/facgetreset",StudentController.facgetreset) 
        this.Router.get("/facassigned",StudentController.Check,StudentController.facassigned)
        this.Router.get("/uploads",StudentController.Check,StudentController.phase2upload)
        this.Router.get("/feedback",StudentController.Check,StudentController.getfeedback)
        this.Router.get("/facultyLogin",StudentController.facultypanel)
        this.Router.get("/facregister",StudentController.facregister)
        this.Router.get("/tagged_students",StudentController.facCheck,StudentController.tagged_students)
        this.Router.get("/admin",StudentController.admin)
        this.Router.get("/findStudent",StudentController.adminCheck,StudentController.findStudentPage)
        this.Router.get("/genExcel",StudentController.adminCheck,StudentController.generateExcelPage)
        this.Router.get("/delStudent",StudentController.adminCheck,StudentController.getDelStudent)
        this.Router.get("/studentDetail",StudentController.adminCheck,StudentController.getStudentDetail)
        this.Router.get("/getcsv",StudentController.adminCheck,StudentController.getuploadcsv)
        this.Router.get("/changeTagging",StudentController.adminCheck,StudentController.changeTaggingPage)   
        this.Router.get("/freeze_unfreeze",StudentController.freeze_unfreezePage)
        this.Router.get("/panel_tagged_students",StudentController.facCheck,StudentController.panel_tagged_students)   
        this.Router.get("/survey",StudentController.survey)  
        this.Router.get("/detailed",StudentController.ps_info)       
    }
    patchRoutes(){
    }
    postRoutes(){
        this.Router.post("/login",StudentController.notCheck,passport.authenticate("student",{
            successRedirect:"/home2",
            failureRedirect:"/login",
            failureFlash:true
        }));
        this.Router.post("/faclogin",StudentController.facnotCheck,passport.authenticate("faculty",{
            successRedirect:"/tagged_students",
            failureRedirect:"/faclogin",
            failureFlash:true
        }));
        this.Router.post("/adminLogin",StudentController.adminNotCheck,passport.authenticate("admin",{
            successRedirect:"/findStudent",
            failureRedirect:"/adminLogin",
            failureFlash:true
        }));
        this.Router.post("/reportseval", StudentController.facCheck, StudentController.reportseval)
        this.Router.post("/signup",StudentValidators.signUp(),StudentController.signUp);
        this.Router.post("/facsignup",StudentValidators.facsignUp(),StudentController.facsignUp);
        this.Router.post("/stuforget",StudentController.stuforget)
        this.Router.post("/facultyforget",StudentController.facultyforget)
        this.Router.post("/reset",StudentController.reset)
        this.Router.post("/facreset",StudentController.facreset)
        this.Router.post("/upload1",StudentController.Check,StudentController.upload1)
        this.Router.post("/upload2",StudentController.Check,StudentController.upload2)
        this.Router.post("/info",StudentController.Check,StudentController.info)
        this.Router.post("/info",StudentController.Check,StudentController.info)
        this.Router.post("/passupdate",StudentController.Check,StudentController.passupdate)
        this.Router.post("/uploads_goalrep",StudentController.Check,StudentController.uploads_goalrep)
        this.Router.post("/uploads_midway",StudentController.Check,StudentController.uploads_midway)
        this.Router.post("/uploads_repfile",StudentController.Check,StudentController.uploads_repfile)
        this.Router.post("/uploads_projppt",StudentController.Check,StudentController.uploads_projppt)
        this.Router.post("/uploads_finletter",StudentController.Check,StudentController.uploads_finletter)
        this.Router.post("/feedbackup",StudentController.Check,StudentController.feedbackup)
        this.Router.post("/display",StudentController.facCheck,StudentController.display)
        this.Router.post("/findStudent",StudentController.adminCheck,StudentController.findStudent)
        this.Router.post("/genExcelData",StudentController.adminCheck,StudentController.genExcelData)
        this.Router.post("/studentDetails",StudentController.adminCheck,StudentController.studentDetails)
        this.Router.post("/adminVerify",StudentController.adminCheck,StudentController.AdminVerify)
        this.Router.post("/removeLetter",StudentController.adminCheck,StudentController.removeLetter)
        this.Router.post("/removeFee",StudentController.adminCheck,StudentController.removeFee)
        this.Router.post("/delStudent",StudentController.adminCheck,StudentController.delStudent)
        this.Router.post("/adminDelete",StudentController.adminCheck,StudentController.adminDelete)
        this.Router.post("/uploadcsv",StudentController.adminCheck,StudentController.uploadcsv)
        this.Router.post("/changeTagging",StudentController.adminCheck,StudentController.changeTagging)
        this.Router.post("/freeze_unfreeze",StudentController.freeze_unfreeze)
        this.Router.post("/facfeedbackup",StudentController.facCheck,StudentController.facfeedbackup,StudentController.getfacfeedback)
        this.Router.post("/facfeedback",StudentController.facCheck,StudentController.getfacfeedback)
        this.Router.post("/evaluate_students", StudentController.facCheck, StudentController.evaluate_students)
        this.Router.post("/student_panel_csv",StudentController.adminCheck,StudentController.student_panel_csv)
        this.Router.post("/faculty_panel_csv",StudentController.adminCheck,StudentController.faculty_panel_csv)
        this.Router.post("/evaluate_display",StudentController.facCheck,StudentController.evaluate_display)

    }
    deleteRoutes(){
        this.Router.get('/logout', (req, res,next) => {
           req.logout();
          })
    }

}
export default new StudentRouter().Router;
