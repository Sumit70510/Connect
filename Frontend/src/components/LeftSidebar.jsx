import React, { useState } from 'react'
import {Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp} from 'lucide-react';
import { AvatarFallback ,Avatar,AvatarImage} from './ui/avatar';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/Redux/authslice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';

export default function LeftSidebar() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector(state => state.auth) || {};
  const user = auth.user;
  
  const [open,setOpen] = useState(false);
  
  const sidebarItems = [
      {icon : <Home/>,
       text : "Home" },
      {icon : <Search/>,
       text : "Search" },
      {icon : <TrendingUp/>,
       text : "Explore" },
      {icon : <MessageCircle/>,
       text : "Messages" },
      {icon : <Heart/>,
       text : "Notifications" },
      {icon : <PlusSquare/>,
       text : "Create" },
      {icon : (
              <Avatar className='w-6 h-6'>
                <AvatarImage src={user?.profilePicture}/>
                <AvatarFallback>{user?.username?.slice(0,2).toUpperCase() || "CN"}</AvatarFallback>
              </Avatar> ),
       text : "Profile" },
      {
       icon : <LogOut/> ,
       text : "Logout"
      }
    ]
  

  const logoutHandler = async()=>
   {
     try
      {
        const res = await axios.get('/api/v1/user/logout',
            { withCredentials : true }
           );
        if(res.data.success)
         {
           dispatch(setSelectedPost(null));
           dispatch(setPosts([]));
           dispatch(setAuthUser(null));
           navigate('/login');
           toast.success(res.data.message); 
         }      
      } 
     catch(error) {
        toast.error(error.response?.data?.message || "Logout failed");
       }
   }
   
  const sidebarHandler = (textType)=>
    {
      if(textType==='Logout')
        {logoutHandler();}
      else
        {
          if(textType==='Create')
           {
            setOpen(true);
           } 
        }    
    } 
    
  return (
     <div className='flex top-0 z-10 left-0 px-4 border-r border-gray-300 h-screen'>
        <div className='flex flex-col px-4 h-full'>
        <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>  
        <div>
          {
            sidebarItems.map((item,index)=>{
               return(
                <div key={index} className="flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer
                    rounded-lg p-3 my-3" onClick={()=>sidebarHandler(item.text)}>
                 {item.icon}
                 <span>{item.text}</span> 
                </div>   
            )})
          }
        </div> 
       </div>
       <CreatePost open={open} setOpen={setOpen}/>
     </div>
  )
}
