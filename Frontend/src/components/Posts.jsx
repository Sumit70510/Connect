import React from 'react';
import Post from './Post.jsx';
import { useSelector } from 'react-redux';

export default function Posts() {
  
  const auth = useSelector(state => state.auth) || {};
  const user = auth.user;
  
  return (
    <div>
      {
        user?.posts?.map((item,index)=><Post key={index}/>)
      }
    </div>
  )
}
