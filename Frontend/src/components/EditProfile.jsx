import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import { setAuthUser, setUserProfile } from '@/Redux/authslice';
import { readFileAsDataURL } from '@/Lib/utils';

export default function EditProfile() {
  const {user} = useSelector(store=>store.auth);
  const [loading,setLoading] = useState(false);
  const imageRef = useRef();
  const [input,setInput] = useState({
    profilePicture : user?.profilePicture , bio : user?.bio , gender : user?.gender });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // const [file,setFile] = useState("");
  const [imagePreview,setImagePreview] = useState("");
  
  const fileChangeHandler = async(e)=>
   {
    const file = e?.target?.files?.[0];
    if(file)
     {
      console.log(file)
      setInput({
        ...input,
        profilePicture : file,
      });
       const dataUrl = await readFileAsDataURL(file);
       setImagePreview(dataUrl);
     } 
   }
 
  const selectChangeHandler = (value)=>
    {
      setInput({...input,gender:value});
    } 
   
  const editProfileHandler = async()=>
   {
     setLoading(true);
     const formData = new FormData();
     formData.append('bio',input.bio);
     formData.append('gender',input.gender);
     if(input?.profilePicture)
      {formData.append('profilePicture',input.profilePicture);}
     try
      {
        const res = await axios.post('/api/v1/user/profile/edit',
          formData ,{
            headers : {
              'Content-Type':'multipart/form-data'
            },
           withCredentials : true 
          }
        );
        if(res.data.success)
         {
          console.log(res?.data?.user?.profilePicture);
          const updatedUserData = {...user , bio : res?.data?.user?.bio ,
              profilePicture : res?.data?.user?.profilePicture ,
              gender : res?.data?.user?.gender
           };
           
          dispatch(setAuthUser(updatedUserData));
          // dispatch(setUserProfile(updatedUserData));
          navigate(`/profile/${user?._id}`);          
          toast.success(res.data.message);
         }     
      }
     catch(error)
      {
        console.log(error);
        toast.error(error.response.data.message);
      }
     finally 
      {setLoading(false);}  
   }
  
  return (
    <div className='flex max-w-2xl mx-auto pl-10'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl'>
          Edit Profile
        </h1>
        <div className='flex items-center justify-between gap-3 bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-3'>        
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt='Profile_image'/>
              <AvatarFallback>{user?.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className='font-bold text-sm'>
                {user?.username}
              </h1>
              <span className='text-gray-600'>
                {user?.bio||'Bio Here'}
              </span>
            </div>
            <div>  
            {
             imagePreview&&(
              <div className='w-full h-64 flex items-center justify-center'>
              <img className='object-cover h-full w-full rounded-md'
                src={imagePreview} alt='Preview_Image'/> 
               </div>
              )  
             } 
           </div>
                
          </div>
          <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler}/>
          <Button onClick={()=>imageRef?.current.click()}
            className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className='font-bold text-xl mb-2'>
            Bio
          </h1>
          <Textarea name='bio' className='focus-visible:ring-transparent'
            value={input.bio} onChange = {(e)=> setInput({...input,bio:e?.target?.value})}
           />
        </div>
        <div>
          <h1 className='font-bold mb-2'>Gender</h1>
          <Select defaultValue={input?.gender}
            onValueChange={selectChangeHandler}>
            <SelectTrigger className='w-full'>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end'>
          {loading?
           (
            <Button className='w-fit bg-[#2a8ccd]'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
              Please Wait
            </Button>
           )
           :
           (
            <Button className='w-fit bg-[#0095f6] hover:bg-[#2a8ccd]'
              onClick={editProfileHandler}>
              Submit
            </Button>
           )
          }
        </div>
      </section>
    </div>
  )
}
