import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/Redux/authslice';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { Button } from './ui/button';


export default function ChatPage() {  
  const {user,suggestedUsers, selectedUser} = useSelector(store=>store.auth);  
  const dispatch = useDispatch();
  const [selected,setSelected] = useState("");
  const {onlineUsers} = useSelector(store=>store.chat);
  const isOnline = true;
  return (
    <div className='flex w-full overflow-x-scroll m-0 p-1 h-screen'>
       <section className='w-full md:w-1/4 my-8'>
         <h1 className='font-bold mb-4 px-3 text-xl'>
            {user?.username}
         </h1>
         <hr className='mb-4 border-gray-300'/>
         <div className='overflow-y-auto h-[80vh]'>
            {
              suggestedUsers.map((suggestedUser)=>
                {
                  return (
                    <div className='flex gap-3 items-center p-3 hover:bg-gray-300 cursor-pointer' 
                      onClick={()=>{dispatch(setSelectedUser(suggestedUser));setSelected(suggestedUser);}}>
                      <Avatar className='w-14 h-14'>
                        <AvatarImage src={suggestedUser?.profilePicture} alt='Profile_image'/>
                        <AvatarFallback>{suggestedUser?.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                         <span className='font-medium'>{suggestedUser?.username}</span> 
                         <span className={`text-xs ${isOnline?'text-green-600':'text-red-600'} font-bold`}>{isOnline?'online':'ofline'}</span> 
                      </div>    
                    </div>   
                   )
                })  
            } 
         </div>
       </section>
       
       {
         selected!==''&&selectedUser?(
            <section className='flex flex-col flex-1 h-full justify-between border-l border-l-gray-300'>
              <div className='flex gap-3 items-center px-3 py-2 mt-1 sticky top-0 border-b border-gray-300 bg-white'>
                <Avatar className='w-14 h-14'>
                  <AvatarImage src={selectedUser?.profilePicture} alt='Profile_image'/>
                  <AvatarFallback>{selectedUser?.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'> 
                   <span>
                     {selectedUser?.username}
                   </span>
                </div>
              </div>  
                <Messages selectedUser={selectedUser}/>    
                <div className='flex items-center py-4 border-t-gray-300'>
                   <input type='text' className='flex-1 ml-2 mr-2 focus-visible:ring-transparent' placeholder='Messages.......'/> 
                   <Button className='mr-1'>Send</Button> 
                </div>       
            </section>
         ) :
         (
           <div className='flex flex-col items-center justify-center mx-auto'>
             <MessageCircleCode className='w-32 h-32 my-4'/>
             <h1 className='font-medium text-xl'>Your Messages</h1>
             <span>Send a Message To Start Chat</span>
           </div>   
         )
        }       
     </div>
  )
}
