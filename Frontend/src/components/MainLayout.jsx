import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="w-[16%] fixed left-0 top-0 h-screen border-r">
        <LeftSidebar />
      </div>
      <div className="flex-1 px-[16%] flex justify-center">
        <div className="w-full max-w-[600px]">
          <Outlet />
        </div>
      </div>
      <div className="w-[16%] fixed right-0 top-0 h-screen border-l hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
