import {User} from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async(req,res)=>
  {
    try{
        const {username,email,password}=req.body;
        if(!username||!email||!password)
         {
           return res.status(401).json({
            message:"Something is Missing, Please Check !",
            success:false
           });
         }
        const user= await User.findOne({email});
        if(user)
         {
           return res.status(401).json({
            message:"User Already Exists",
            success:false
           }); 
         }  
        const hashedPassword = await bcrypt.hash(password,10); 
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword
        })       
        return res.status(201).json({
            message : "Account Created Successfully",
            success : true
        });
     }
    catch(error)
     {
       console.log(error);  
     }
  }

// have doubt  
export const login = async(req,res)=>
  {
     try
      {
        const {email,password}=req.body;
         if(!email||!password)
         {
           return res.status(401).json({
            message:"Something is Missing, Please Check !",
            success:false
           });
         }
        const user = await User.findOne({email});
        if(!user)
         {
           return res.status(401).json({
            message:"Incorrect Credentials",
            success:false
           }); 
         }  
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch) 
         {
           return res.status(401).json({
            message:"Incorrect Credentials",
            success:false
           });   
         }   
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,{expiresIn:'1d'});
        const USER={
            _id:user._id,
            username : user.username,
            email : user.email,
            profilePicture : user.profilePicture,
            bio : user.bio,
            followers:user.followers,
            following:user.following,
            posts:user.posts
        }
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000})
        .json({
            message : `Welcome Back ${USER.username}`,
            success : true
        });
      }
     catch(error)
      {
        console.log(error);
      }     
  }
  
export const logout = async(req,res)=>
  {
    try
     {
       return res.cookie("token","",{maxAge:0}).
       json({
         message : "Logged Out Successfully",
         success : true
       });  
     }
    catch(error)
     {
       console.log(error);  
     }    
  }

export const getProfile = async(req,res)=>
  {
      try
       {
         const userId=req.params.id;
         let user =  await User.findById(userId);
         if(!user)
          {
           return res.status(401).json({
            message:"No Such User Exists",
            success:false
           }); 
          }  
         return res.status(200).json({
            user,
            success:true
         })
       }
      catch(error)
       {
         console.log(error);
       }   
  }
 
//on hold  
export const editProfile = async(req,res)=>
  {
    try
     {
       const profilePicture=req.file;
       const userId=req.id;
       const {bio,gender}=req.body;
       let cloudResponse;
       if(profilePicture)
        {
          const fileUri = getDataUri(profilePicture);
        }
     }
    catch(error)
     {
      console.log(error);  
     }       
  } 