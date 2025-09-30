import { setPosts } from '@/Redux/postSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function useGetAllPost() {
   const dispatch = useDispatch();
   useEffect(()=>{
      const fetchAllPost = async ()=>{
        try
         {
           const res = await axios.get('/api/v1/post/all',
                 {withCredentials:true});
           if(res.data.success)
            {
              console.log(res.data.posts);  
              dispatch(setPosts(res.data.posts));  
            }  
         }
        catch(error)
         {
           console.log(error); 
         }
        }
        fetchAllPost();}
       ,[dispatch]); 
}
