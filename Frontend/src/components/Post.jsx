import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart , FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog.jsx';
import { useState } from 'react';
export default function Post() 
 {
   const [text,setText] = useState("");
   const [open,setOpen] = useState(false);
   
   const changeEventHandler = (e)=>
     {
        const inputText = e.target.value;
        if(inputText.trim())
         {
           setText(inputText); 
         }
        else
         {
           setText("");
         }       
     }
       
   return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center gap-2'>
         <Avatar>
            <AvatarImage src="" alt='Post_image'/>
            <AvatarFallback>CN</AvatarFallback>
         </Avatar>
         <h1>Username</h1>
         <div className='flex items-center justify-between'>
            <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className='flex flex-col items-center text-sm text-center'>
                    <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>
                        Unfollow
                    </Button>
                    <Button variant='ghost' className='cursor-pointer w-fit '>
                        Add to Favourites
                    </Button>
                    <Button variant='ghost' className='cursor-pointer w-fit '>
                        Delete
                    </Button>
                </DialogContent>
            </Dialog>
         </div>
      </div>
      
      <img src='https://www.pixelstalk.net/wp-content/uploads/2016/07/Desktop-hd-3d-nature-images-download.jpg'
         className='rounded-sm my-2 aspect-square object-cover mx-auto'/>
      
      <div className='flex items-center justify-between my-2'>
       <div className='flex items-center gap-3'>
         <FaRegHeart size={'22px'}/>
         <MessageCircle onClick={()=>setOpen(true)} className='cursor-pointer hover:text-gray-600'/>
         <Send className='cursor-pointer hover:text-gray-600'/>
       </div>
         <Bookmark className='cursor-pointer hover:text-gray-600'/>
      </div>   
      
     <span className='font-medium block mb-2'>
        1K Likes
     </span> 
     <p>
        <span className='font-medium mr-2'>
            Caption
        </span>
     </p>
     <span onClick={()=>setOpen(true)} 
        className='cursor-pointer text-sm text-gray-400'>
        View all 10 Comments
     </span>
     <CommentDialog open={open} setOpen={setOpen}/>
     <div className='flex justify-between mx-2'>
        <input type='text' placeholder='Add a Comment...'
          value={text} onChange={changeEventHandler} 
          className='outline-none text-sm w-full'/>
        {
          text&&<span className='text-[#3BADF8]'>Post</span>
        }
     </div>
       
    </div>
  )
}
