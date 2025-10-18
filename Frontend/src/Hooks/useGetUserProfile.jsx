import { setUserProfile } from "@/Redux/authslice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function useGetUserProfile(userId) {
//    const [userProfile,setUserProfile] = useState(null);
   const dispatch = useDispatch();
   useEffect(()=>{
      const fetchUserProfile = async ()=>{
        try
         {
           const res = await axios.get(`/api/v1/user/${userId}/profile`,
                 {withCredentials:true});
           if(res.data.success)
            {
              console.log(res.data.user);  
              dispatch(setUserProfile(res.data.user));  
            }  
         }
        catch(error)
         {
           console.log(error); 
         }
        }
        fetchUserProfile();}
       ,[userId,dispatch]); 
}
