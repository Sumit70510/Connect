import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import React from 'react'

export default function Comment({comment}) {
  return (
    <div className='my-1 py-1'> 
      <div className='flex gap-2 items-center'>
        <Link to={`/profile/${comment?.author?._id}`}>
        <Avatar className='text-black cursor-pointer'>
            <AvatarImage src={comment?.author?.profilePicture}/>
            <AvatarFallback>
             {comment?.author?.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
         </Avatar>
        </Link>
      <span className='font-normal pl-1'>
       <Link to={`/profile/${comment?.author?._id}`}>
         <span className='cursor-pointer font-bold text-sm mt-2 mr-1'>
          {comment?.author?.username}{"  "}
         </span>
       </Link>
        {comment?.text}
      </span>
      </div>
    </div>
  )
}
