import store from '@/Redux/store.js';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';

export default function SuggestedUsers() {
//   const {user} = useSelector(state=>state.auth);  
  const { suggestedUsers = [] } = useSelector((store) => store.auth);

  return(
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm gap-2'>
         <h1 className='font-semibold text-gray-600'>
          Suggested Fou You
         </h1>
         <span className='font-medium cursor-pointer'>
           See All
         </span>     
       </div>
      {
          suggestedUsers.map((user)=>{
           return (
            <div key={user._id} className="flex my-5 items-center gap-3 justify-between">
             <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
              <Avatar>
               <AvatarImage src={user?.profilePicture} />
               <AvatarFallback>
                {user?.username?.slice(0, 2)?.toUpperCase()}
               </AvatarFallback>
              </Avatar>
              <div className="w-6">
                {user?.username}
                {/* <span className="text-gray-600 text-sm">{user?.bio}</span> */}
              </div>
             </Link>
             <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">
               Follow
             </span>
            </div>
           )   
      })
     }
     </div>
  )
}
