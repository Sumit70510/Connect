import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

export default function CommentDialog({open,setOpen}) {
  
  const [text,setText]=useState("");
  
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
   
  const sendMessageHandler = async()=>
   {
     alert(text); 
   }  
  
  return(
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=>setOpen(false)}
            className='max-w-8xl p-0 flex flex-col w-[1000px] h-[400px]'>
           <div className='flex flex-1 h-full'>
            <div className='w-1/2 h-full'>
              <img src='https://www.pixelstalk.net/wp-content/uploads/2016/07/Desktop-hd-3d-nature-images-download.jpg'
                className='w-full h-full object-cover rounded-l-lg'/>
            </div> 
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='flex items-center justify-between px-4 py-1'>
                <div className='flex gap-3 items-center'>       
                <Link>
                 <Avatar>
                    <AvatarImage src=''/>
                    <AvatarFallback>
                        CN
                    </AvatarFallback>
                 </Avatar>
                </Link>
                 <div>
                   <Link className='font-semibold text-xs'> 
                     Username
                   </Link> 
                   <span className='text-gray-600 text-sm'> Bio Here </span>
                 </div>
                </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className='flex flex-col items-center text-sm text-center'>
                  <div className='cursor-pointer w-full font-bold text-[#ED4956]'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add To Favourite
                  </div>
                </DialogContent>
               </Dialog>
              </div>   
              <hr/>
              <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                Comments
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-1 w-full'>
                  <input type='text' placeholder='Add a Comment........'
                    onChange={changeEventHandler}
                    value={text} className='outline-none text-sm flex-1 min-w-0'/>
                  <Button disabled={!text.trim()} onClick={sendMessageHandler} 
                    variant='outline' className='flex-shrink-0' >Send</Button>
                </div>
              </div>
            </div>   
           </div>
        </DialogContent>
    </Dialog>  
   )
}
