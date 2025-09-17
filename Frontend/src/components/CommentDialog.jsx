import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function CommentDialog({open,setOpen}) {
  
  return(
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=>setOpen(false)}
            className='max-w-7xl p-0 flex flex-col w-[600px] h-[400px]'>
           <div className='flex flex-1 h-full'>
            <div className='w-1/2 h-full'>
              <img src='https://www.pixelstalk.net/wp-content/uploads/2016/07/Desktop-hd-3d-nature-images-download.jpg'
                className='w-full h-full object-cover rounded-l-lg'/>
            </div> 
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='flex items-center justify-between p-4'>
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
              </div>   
            </div>   
           </div>
        </DialogContent>
    </Dialog>  
   )
}
