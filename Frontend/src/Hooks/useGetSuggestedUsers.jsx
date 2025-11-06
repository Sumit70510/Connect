import { setSuggestedUsers } from '@/Redux/authslice';
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function useGetSuggestedUsers() {
   const dispatch = useDispatch();
   useEffect(()=>{
      const fetchSuggestedUsers = async ()=>{
        try
         {
           const res = await axios.get('/api/v1/user/suggested',
                 {withCredentials:true});
           if(res.data.success)
            {
              console.log(res.data.users);  
              dispatch(setSuggestedUsers(res.data.users));  
            }  
         }
        catch(error)
         {
           console.log(error); 
         }
        }
        fetchSuggestedUsers();}
       ,[dispatch]); 
}
