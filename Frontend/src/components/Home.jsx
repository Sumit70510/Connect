import React from 'react';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar.jsx';
import Feed from './Feed.jsx';
import useGetAllPost from '@/Hooks/useGetAllPost.jsx';

export default function Home() {
  // useGetAllPost();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div> 
    </div>
  )
}
