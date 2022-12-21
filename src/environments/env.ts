import { Interface } from "readline";
import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./prod.env";

export interface Environment{
    db_url:string
}

export function getEnvironmentVars(){
    if(process.env.NODE_ENV==='production'){
        return ProdEnvironment
    }
    return DevEnvironment
}
export function creds(){
    return  {
        user: "272a0ae931dc87",
        pass: "48bf858b3b8b90"
      }
}
