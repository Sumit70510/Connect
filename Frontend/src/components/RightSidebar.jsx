import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router';
import SuggestedUsers from './SuggestedUsers';

export default function RightSidebar() {
  const {user} = useSelector(state=>state.auth);
  return (
    <div className='w-fit my-10 p-2 pl-6'>
      <div className='flex items-center gap-2'>
         <Link to={`/profile/${user?._id}`}>
          <Avatar>
           <AvatarImage src={user?.profilePicture}/>
            <AvatarFallback>
             {user?.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
           </Avatar>
         </Link>
         <div>
           <Link className='font-semibold text-xs' to={`/profile/${user?._id}`}> 
             {user?.username}
           </Link> 
           <span className='text-gray-600 text-sm'> {user?.bio} </span>
         </div>  
      </div>
         <SuggestedUsers/>      
    </div>
  )
}
