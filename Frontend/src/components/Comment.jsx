import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import React from 'react'

export default function Comment({comment}) {
  return (
    <div className='my-1 py-1'> 
      <div className='flex gap-2 items-center'>
        <Avatar>
            <AvatarImage src={comment?.author?.profilePicture}/>
            <AvatarFallback>
             {comment?.author?.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
      <span className='font-normal pl-1'>
       <span className='font-bold text-sm mt-2 mr-1'>
        {comment?.author?.username}{"  "}
       </span>
        {comment?.text}
      </span>
      </div>
    </div>
  )
}
