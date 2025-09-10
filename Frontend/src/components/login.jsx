import React,{useState} from 'react';
import { Button } from './ui/button.jsx';
import {Input} from './ui/input.jsx'
import axios from 'axios';
import { toast } from 'sonner';
import {Link, useNavigate} from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Login() {
    
   const [input,setInput] = useState({
    email : "" , password : "" }); 
   
   const [loading,setloading]=useState(false);  
   
   const navigate = useNavigate();
   
   const changeEventHandler = (e)=>
     {
      setInput({...input,[e.target.name]:e.target.value})
     }  
   
       
   const signupHandler = async(e)=>
    { 
      e.preventDefault();
      try
       {
          setloading(true);
          const res = await axios.post('/api/v1/user/login',input,{
                headers : { "content-type" : 'application/json' },
                withCredentials : true }); 
          if(res.data.success)
           {
             navigate('/');
             toast.success(res.data.message);
             setInput({username : "", email : "" , password : "" }) 
           }          
       }
      catch(e)
       {
        //  console.log(e); 
         toast.error(e.response?.data?.message || "Something Went Wrong");
       }
       finally
       {
        setloading(false); 
       }
    }  
   return (
     <div className='flex items-center w-screen h-screen justify-center'>
        <form className='shadow-lg flex flex-col gap-5 p-8' onSubmit={signupHandler}>
           <div className='my-4'>
             <h1 className='text-center font-bold text-xl'>
                LOGO
             </h1>
             <p className='text-sm text-center'>
               Login To See Photos & Videos From Your Friends 
             </p>
           </div>  
           <div>
            <span  className='font-medium my-2'>
             Email
            </span>
            <Input className='focus-visible:ring-transparent my-2'
             type='email' name='email' value={input.email} onChange={changeEventHandler}/> 
           </div>  
           <div>
            <span  className='font-medium my-2'>
             Password
            </span>
            <Input className='focus-visible:ring-transparent my-2'
             type='password' name='password'value={input.password} onChange={changeEventHandler}/> 
           </div>
            {
             loading?(<Button>
                       <Loader2 className='mr-2 h-4 w-4 animate-spin'/> 
                         Please Wait...                
                      </Button>)
              : (<Button type='submit'>Login</Button>)
             }  
            <span className="text-center">
            Doesn't Have an Account ?
            <Link to='/signup' className='text-blue-600'> SignUp</Link>
            </span> 
        </form>
     </div>
   )
}
