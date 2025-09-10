import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

export default function Post() {
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center gap-2'>
         <Avatar>
            <AvatarImage src="" alt='Post_image'/>
            <AvatarFallback>CN</AvatarFallback>
         </Avatar>
         <h1>Username</h1>
         <div className='flex items-center justify-between'>
            <Dialog >
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
                    <Button variant='ghost' className='cursor-pointer w-fit '>
                        Delete
                    </Button>
                </DialogContent>
            </Dialog>
         </div>
      </div>
      <img src='https://tse3.mm.bing.net/th/id/OIP.U_VJuupQohwnzXcKMztqWgHaEo?r=0&cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3'/>
    </div>
  )
}
