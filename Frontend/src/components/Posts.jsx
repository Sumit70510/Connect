import React from 'react';
import Post from './Post.jsx';

export default function Posts() {
  return (
    <div>
      {
        [1,2,3,4].map((item,index)=><Post key={index}/>)
      }
    </div>
  )
}
