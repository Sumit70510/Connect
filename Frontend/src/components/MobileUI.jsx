import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { toast } from 'sonner';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';
import { setAuthUser } from '@/Redux/authslice';

export default function MobileUI() {  
    
   const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector(state => state.auth) || {};
  const user = auth.user;
  
  const [open,setOpen] = useState(false);
  
  const headerItems = [
      //   {icon : <TrendingUp/>,
      //    text : "Explore" },
        {icon : <MessageCircle/>,
         text : "Messages" },
        {
         icon : <LogOut/> ,
         text : "Logout"
        }
  ];
  
  const footerItems = [
      {icon : <Home/>,
       text : "Home" },
      {icon : <Search/>,
       text : "Search" },
      {icon : <PlusSquare/>,
       text : "Create" },
      {icon : <Heart/>,
       text : "Notifications" },
      {icon : (
              <Avatar className='w-6 h-6'>
                <AvatarImage src={user?.profilePicture}/>
                <AvatarFallback>{user?.username?.slice(0,2).toUpperCase() || "CN"}</AvatarFallback>
              </Avatar> ),
       text : "Profile" },
    ];
  

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
   
  const navbarHandler = (textType)=>
    {
      switch(textType) 
       {
         case 'Logout':
           logoutHandler(); break;
         case 'Create':
           setOpen(true);   break;
         case 'Home':
           navigate('/');   break;
         case 'Profile':
           navigate(`/profile/${user._id}`); break;
         case 'Messages':
           navigate('/chat'); break;
         default:
           // Handle other cases if needed
          break;
       }
    } 
    
   const {likeNotification} = useSelector(store=>store.realTimeNotification); 
   
    
  return (
    <div className="flex flex-col h-screen">
      
    {/* Header */}
    <header className="h-12 flex items-center justify-between px-4 border-b bg-white fixed top-0 left-0 right-0 z-10">
     <h1 className="text-lg font-bold">LOGO</h1>
     <div className="flex items-center gap-3">
       {
         headerItems.map((item, index) => (
         <button
          key={index}
          className="flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg p-2"
          onClick={() => navbarHandler(item.text)}
          aria-label={item.text} >
            <span className="text-xl">{item.icon}</span>
         </button>))
       }
     </div>
    </header>


    {/* Scrollable Feed */}
    <div className="flex-1 overflow-y-auto pt-12 pb-12 p-1">
      <Outlet />
    </div>

    {/* Footer */}
    <footer className="h-12 flex items-center justify-around border-t bg-white fixed bottom-0 left-0 right-0 z-10">
       {footerItems.map((item, index) => (
        <button
          key={index}
          className="flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3" 
          onClick={()=>navbarHandler(item.text)} aria-label={item.text}>
            <span className="text-xl">{item.icon}</span>
        </button>))
       }
     </footer>
     <CreatePost open={open} setOpen={setOpen}/>
   </div>
  );
}
