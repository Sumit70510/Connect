import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart , FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog.jsx';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';
import { Badge } from './ui/badge';
export default function Post({post}) 
 {
   const [text,setText] = useState("");
   const [open,setOpen] = useState(false);
   const {user} = useSelector(store=>store.auth);
   const {posts} = useSelector(store=>store.post);
   const dispatch = useDispatch();
   const [postLike , setPostLike] = useState(post?.likes?.length);
   const [liked,setLiked] = useState(post?.likes?.includes(user?._id)||false);
   const [comment,setComment] = useState(post?.comments);
   
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
     
   const commentHandler = async()=>
     {
        try
         {
           const res = await axios.post(`/api/v1/post/${post?._id}/comment`,{text},
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
                p?._id===post?._id?{...p,comments:updatedCommentData}:p
               );
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
   
   const likeOrDislikeHandler = async()=>
     {
       try
        {
          const action = liked?'dislike':'like';
          const res = await axios.get(`/api/v1/post/${post._id}/${action}`,
                {withCredentials : true});
          if(res.data.success)
           {
             const updateLikes = liked ? postLike-1 : postLike+1 ;
             setPostLike(updateLikes); 
             const updatedPostData = posts.map(p=>
              p._id===post._id?{...p,likes:liked?p.likes.filter(id=>id!=user._id) : [...p.likes,user._id]}:p
             )
             dispatch(setPosts(updatedPostData));
             setLiked(!liked);
             toast.success(res.data.message);
           }                    
        }
       catch(error)
        {
          console.log(error);
        } 
     }  
     
   const deletePostHandler = async ()=>
     {
        try
         {
           const res = await axios.delete(`/api/v1/post/delete/${post._id}`,
                             {withCredentials : true});
           if(res.data.success)
            {
              const updatePostData = posts.filter((postItem)=>
               postItem?._id!==post?._id);
              dispatch(setPosts(updatePostData));
              toast.success(res.data.message);
            }                  
         }
        catch(error)
         {
           console.log(error);
           toast.error(error.response.data.message);
         }   
     }  
     
   return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between px-1 gap-2'>
        <div className='flex items-center gap-2'> 
         <Avatar>
            <AvatarImage src={post?.author?.profilePicture} alt='Post_image'/>
            <AvatarFallback>{post?.author?.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
         </Avatar>
         <h1>{post?.author?.username}</h1>
         {user?._id===post?.author?._id&&<Badge variant='secondary'>Author</Badge>}
         </div>
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
                   { user&&user?._id==post?.author?._id&&
                     <Button variant='ghost' className='cursor-pointer w-fit' onClick={deletePostHandler}>
                        Delete
                    </Button> }
                </DialogContent>
            </Dialog>
         </div>
      </div>
      
      <img src={post?.image}//'https://www.pixelstalk.net/wp-content/uploads/2016/07/Desktop-hd-3d-nature-images-download.jpg'
         className='rounded-sm my-2 aspect-square object-contain mx-auto'/>
      
      <div className='flex items-center justify-between my-2'>
       <div className='flex items-center gap-3'>
         {liked?<FaHeart size={'22px'} className='cursor-pointer text-red-600' onClick={likeOrDislikeHandler}/>
           :<FaRegHeart size={'22px'} onClick={likeOrDislikeHandler}/>}
         <MessageCircle onClick={()=>{
            dispatch(setSelectedPost(post));
            setOpen(true);
         }} className='cursor-pointer hover:text-gray-600'/>
         <Send className='cursor-pointer hover:text-gray-600'/>
       </div>
         <Bookmark className='cursor-pointer hover:text-gray-600'/>
      </div>   
      
     {post?.likes ? (
         <span className='font-medium block mb-2'>
          {postLike?`${postLike} likes`:""}
         </span> ) : null}
         
     <p>
        <span className='font-medium mr-2'>
         {post?.author?.username}
        </span>
         {post?.caption}
     </p>
     <span  onClick={()=>{
            dispatch(setSelectedPost(post));
            setOpen(true);
         }}
        className='cursor-pointer text-sm text-gray-400'>
        {post?.comments?.length?`View all ${post?.comments?.length} Comments`:""}
     </span>
     <CommentDialog open={open} setOpen={setOpen} post={post}/>
     <div className='flex justify-between mx-2'>
        <input type='text' placeholder='Add a Comment...'
          value={text} onChange={changeEventHandler} 
          className='outline-none text-sm w-full'/>
        {
          text&&<span className='text-[#3BADF8] cursor-pointer' onClick={commentHandler}>Post</span>
        }
     </div>
       
    </div>
  )
}