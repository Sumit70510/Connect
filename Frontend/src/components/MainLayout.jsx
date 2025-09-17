import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
       <LeftSidebar/>
      <div className="flex-1 flex flex-col">
       <Outlet/>
      </div>
    </div>
  )
}