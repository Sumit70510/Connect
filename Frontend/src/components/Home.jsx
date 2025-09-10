import React from 'react';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar.jsx';
import Feed from './Feed.jsx';

export default function Home() {
  return (
    <div className='flex'>
       <Feed/>
      <div className='flex-grow'>
        <Outlet/>
      </div> 
      <RightSidebar/>
    </div>
  )
}
