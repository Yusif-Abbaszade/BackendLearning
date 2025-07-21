import mongoose from "mongoose";

import {DB_URI , NODE_ENV} from "../config/env.js"

if(!DB_URI){
    throw new Error('DB_URI not found!');
}


const connectToDatabase = async ()=>{
    try{
        await mongoose.connect(DB_URI);

        console.log(`Connected to Database in ${NODE_ENV} mode`);
    }
    catch(error){
        console.log("Error :", error);

        process.exit(1);
    }
}

export default connectToDatabase;