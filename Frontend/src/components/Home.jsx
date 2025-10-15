import React from 'react';
import { Outlet } from 'react-router-dom';
import Feed from './Feed.jsx';
import useGetAllPost from '@/Hooks/useGetAllPost.jsx';
import useGetSuggestedUsers from '@/Hooks/useGetSuggestedUsers.jsx';

export default function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div> 
    </div>
  )
}
