import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router'
import { Button } from './ui/button'

export default function Messages({selectedUser}) {
  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
           <Avatar className='w-20 h-20'>
              <AvatarImage src={selectedUser?.profilePicture} alt='Profile_image'/>
              <AvatarFallback>{selectedUser?.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
            </Avatar> 
            <span> 
              {selectedUser?.username}
            </span>
            <Link to={`/profile/${selectedUser?._id}`}>
               <Button className='h-8 my-2 cursor-pointer hover:bg-gray-400' variant='secondary'>
                 View Profile
               </Button>
            </Link>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {
           [1,2,3,4].map((message)=>{
            return(
              <div className='flex'>
                <div>
                  {message}
                 </div>   
              </div>      
            )
           }) 
        }
      </div> 
    </div>
  )
}
