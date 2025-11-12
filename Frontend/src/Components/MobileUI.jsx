import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import CreatePost from './CreatePost.jsx';
import { setPosts, setSelectedPost } from '@/Redux/postSlice.js';
import { setAuthUser } from '@/Redux/authslice.js';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.jsx';
import { Button } from './ui/button.jsx';

export default function MobileUI() {  
    
   const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector(state => state.auth) || {};
  const user = auth.user;
  
  const [open,setOpen] = useState(false);
  
  const headerItems = [
      //   {icon : <TrendingUp/>,
      //    text : "Explore" },
        {icon : <MessageCircle className='text-white'/>,
         text : "Messages" },
        {
         icon : <LogOut className='text-white'/> ,
         text : "Logout"
        }
  ];
  
  const footerItems = [
      {icon : <Home className='text-white'/>,
       text : "Home" },
      {icon : <Search className='text-white'/>,
       text : "Search" },
      {icon : <PlusSquare className='text-white'/>,
       text : "Create" },
      {icon : <Heart className='text-white'/>,
       text : "Notifications" },
      {icon : (
              <Avatar className='w-6 h-6 text-white'>
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
    <header className="h-12 flex items-center justify-between px-4 border-b border-zinc-700 bg-zinc-900 bg-opacity-70 fixed top-0 left-0 right-0 z-10">
     <h1 className="text-lg font-bold text-white">LOGO</h1>
     <div className="flex items-center gap-3">
       {
         headerItems.map((item, index) => (
         <button
          key={index}
          className="flex items-center justify-center hover:bg-green-900 cursor-pointer rounded-lg p-2"
          onClick={() => navbarHandler(item.text)}
          aria-label={item.text} >
            <span className="text-xl">{item.icon}</span>
         </button>))
       }
     </div>
    </header>


    {/* Scrollable Feed */}
    <div className="flex-1 overflow-y-scroll hide-scrollbar pt-12 pb-12">
      <Outlet />
    </div>

    {/* Footer */}
    <footer className="h-12 flex items-center justify-around border-t border-zinc-700 bg-zinc-900 bg-opacity-70 fixed bottom-0 left-0 right-0 z-10">
       {footerItems.map((item, index) => (
        <button
          key={index}
          className="flex items-center gap-3 relative hover:bg-green-900 cursor-pointer rounded-lg p-3 my-3" 
          onClick={()=>navbarHandler(item.text)} aria-label={item.text}>
            <span className="text-xl">{item.icon}</span>
             {
                    item.text==='Notifications'&&likeNotification.length!==0&&
                    (
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button size='icon' className='rounded-full h-5 w-5
                          absolute bottom-6 left-6 bg-red-600 hover:bg-red-600'>
                          {likeNotification.length}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent>
                        <div>
                          {likeNotification.length===0?
                            (<p>No New Notification</p> )
                             :
                            (
                              likeNotification.map((notification)=>{
                                return (
                                  <div key={notification?.userId} className='flex items-center gap-2 my-2'>
                                    <Avatar className='w-6 h-6'>
                                      <AvatarImage src={notification?.userDetails?.profilePicture}/>
                                      <AvatarFallback>{notification?.userDetails?.username.slice(0,2).toUpperCase() || "CN"}</AvatarFallback>
                                    </Avatar>
                                    <p className='text-sm'>
                                     <span className='font-bold'>
                                      {notification?.userDetails?.username}
                                     </span> 
                                      liked Your Post
                                    </p>
                                  </div>
                                )
                              })
                            )
                          }
                        </div>
                       </PopoverContent>
                     </Popover> 
                    )
                  }
        </button>))
       }
     </footer>
     <CreatePost open={open} setOpen={setOpen}/>
   </div>
  );
}
