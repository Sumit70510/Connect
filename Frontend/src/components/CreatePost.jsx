import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { readFileAsDataURL } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/Redux/postSlice';

export default function CreatePost({open,setOpen}) {
   const [caption,setCaption] = useState(""); 
   const imageRef = useRef();
   const [file,setFile] = useState("");
   const [imagePreview,setImagePreview] = useState("");
   const [loading,setLoading] = useState(false);
   const {user} = useSelector(store=>store.auth);
   const {posts} = useSelector(store=>store.post);
   const dispatch = useDispatch();
   const fileChangeHandler = async(e)=>
     {
       const File=e?.target?.files?.[0];
       if(File)
        {   
         setFile(File);    
         const dataUrl = await readFileAsDataURL(File);
         setImagePreview(dataUrl);
        }   
     }
  
    const createPostHandler = async(e)=>
      {
         const formData= new FormData();
         formData.append('caption',caption);
         if(imagePreview)
          {
            formData.append('image',file); 
          } 
         try{
           setLoading(true);
           const res = await axios.post('/api/v1/post/addpost',formData,
             {
               headers : {
                'content-Type':'multipart/form-data'
               },withCredentials:true
             }
            );
           if(res.data.success)
            {
              dispatch(setPosts([res.data.post,...posts]));
              toast.success(res.data.message);  
              setOpen(false);
            }  
         }  
        catch(error)
         {
           toast.error(error.response.data.message);
         }
        finally
         {
            setLoading(false);
         }  
      }
      
   return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={()=>setOpen(false)}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader> 
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt='img'/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='font-semibold text-xs text-gray-600'>{user?.bio}</span>
          </div>
        </div>  
        <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)}
         className='focus-visible:ring-transparent border-none' placeholder='Write a Caption........'/>
         {
          imagePreview&&(
            <div className='w-full h-64 flex items-center justify-center'>
              <img className='object-cover h-full w-full rounded-md'
                src={imagePreview} alt='Preview_Image'/> 
            </div>
          )  
         } 
        <input type='file' className='hidden' ref={imageRef} onChange={fileChangeHandler}/>
        <Button className='w-fit mx-auto bg-[#0095F6] hover:bg-[#045d99]' onClick={()=>imageRef.current.click()}>
         Select From Device</Button>    
        {
          imagePreview&&(
            loading?
             (
               <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please Wait.....
               </Button> 
             ):
             (
               <Button onClick={createPostHandler} type='submit' className='w-full'>
                 Post
               </Button> 
             )
           )
        } 
      </DialogContent> 
    </Dialog>
  )
}
