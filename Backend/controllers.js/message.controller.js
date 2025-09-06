import { Conversation } from "../Models/conversation.model.js";
import { Message } from "../Models/message.model.js"

export const sendMessage = async (req,res)=>
 {
   try 
    {
      const senderId   = req.id;
      const recieverId = req.params.id;
      const {message}  = req.body;
      
      let conversation = await Conversation.findOne({participants:{$all:[senderId,recieverId]}});
      
      if(!conversation)
       {conversation= await Conversation.create({participants:[senderId,recieverId],messages:[]});}
      
      const newMessage = await Message.create({senderId,recieverId,message});
      
      if(newMessage) 
       {conversation.messages.push(newMessage._id);}
      
      await Promise.all([conversation.save(),newMessage.save()]);
      
      //Implement socket.io for real time data Transfer
      
      return res.status(201).json({
        success : true,
        newMessage });
       
    } 
   catch(error)
    {
      console.log(error);
      res.status(500).json({message:'Internal Server Error',success:false});  
    } 
 }
 
export const getMessage = async(req,res)=>
 {
    try 
     {
       const senderId=req.params.id;
       const recieverId=req.id;
       const conversation = await Conversation.findOne({participants:{$all:[senderId,recieverId]}})
                            .populate({
                             path: "messages",
                             populate: {
                                path: "senderId", 
                                select: "username , profilePicture"
                                   } });
       
       if(!conversation)
        { return res.status(200).json({
            success : true,
            messages : []
          }); }
       
       return res.status(200).json({
        success : true,
        messages : conversation.messages });      
     
      }
    catch(error)
     {
       console.log(error);
       res.status(500).json({message:'Internal Server Error',success:false});  
     }  
 }