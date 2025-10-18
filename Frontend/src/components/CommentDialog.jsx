import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/Redux/store';
import Comment from './comment';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';
import { toast } from 'sonner';

export default function CommentDialog({open,setOpen,post}) {
  
  const [text,setText]=useState("");
  const {selectedPost,posts} = useSelector(store=>store.post);
  const [comment,setComment]=useState([]);
  const dispatch = useDispatch();
  
  useEffect(() => {
  // console.log("selectedPost updated:", selectedPost);
  if (selectedPost) {
    setComment(selectedPost?.comments || []);
  }
}, [selectedPost]);
  
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
        try
         {
           const res = await axios.post(`/api/v1/post/${selectedPost._id}/comment`,{text},
             {
              headers:{
                 "Content-Type": "application/json" 
               }, withCredentials : true
             }
            );
           if(res.data.success)
            {
              const updatedCommentData = [...comment,res.data.comment];
              setComment(updatedCommentData);
              const updatedPostData =  posts.map(p=> 
                p._id===post._id?{...p,comments:updatedCommentData}:p
               );
              const updatedSelectedPost = {
              ...selectedPost,
             comments: updatedCommentData,
              };
              dispatch(setSelectedPost(updatedSelectedPost));
              dispatch(setPosts(updatedPostData)); 
              setText('');
              toast.success(res.data.message);
            } 
         }
        catch(error)
         {
           console.log(error);
         } 
     }  
  
  return(
   <Dialog 
  open={open} className='p-0 border-none'>
  <DialogContent 
    onInteractOutside={() => setOpen(false)}
    style={{ width: '900px', maxWidth: 'none', height: '600px' }}
    className="p-0 flex flex-col border-none !w-[950px] h-[600px] max-w-none"
  >
           <div className='flex flex-1 h-full'>
            <div className='w-1/2 h-full'>
              <img src={selectedPost?.image}
                className='w-full h-full bg-black object-contain rounded-l-lg'/>
            </div> 
            <div className='w-1/2 flex flex-col'>
              <div className='flex items-center justify-between px-4 p-4'>
                <div className='flex gap-3 items-center'>       
                <Link>
                 <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture}/>
                    <AvatarFallback>
                      {selectedPost?.author?.username?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                 </Avatar>
                </Link>
                 <div>
                   <Link className='font-semibold text-xs'> 
                     {selectedPost?.author?.username}
                   </Link> 
                   <span className='text-gray-600 text-sm'> {selectedPost?.author?.bio} </span>
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
              <div className='flex-1 overflow-y-auto max-h-auto p-4'>
                 { selectedPost?.comments?.map((comment)=>
                     <Comment key={comment._id} comment={comment}/>
                    )   
                 }
              </div>
              <div className='p-4 mt-auto'>
                <div className='flex items-center gap-1 w-full'>
                  <input type='text' placeholder='Add a Comment........'
                    onChange={changeEventHandler}
                    value={text} className='outline-none text-sm flex-1 min-w-0'/>
                  <Button disabled={!text.trim()} onClick={sendMessageHandler} 
                    variant='outline' className='flex-shrink-0 cursor-pointer' >Send</Button>
                </div>
              </div>
            </div>   
           </div>
        </DialogContent>
    </Dialog>  
   )
}
