import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDB from './utils/db.js';

dotenv.config();
const app=express();
app.use(express.json());
app.use(urlencoded({extended:true}));
const corsOption={
    origin : "http:localhost:5173",
    credentials : true
}
app.use(cors(corsOption));
const PORT=process.env.PORT||3000;

app.get("/",(req,res)=>{
    return res.status(200).json({
        message :"I'm Coming From Backend",
        success : true
    })
});

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server Listen To Port ${PORT}`);
})