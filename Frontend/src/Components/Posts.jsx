import React from 'react';
import Post from './Post.jsx';
import { useSelector } from 'react-redux';

export default function Posts() {
  
  const {posts} = useSelector(store=>store.post);
  
  return (
    <div>
      {
        posts?.map((post)=><Post post={post} key={post._id}/>)
      }
    </div>
  )
}
