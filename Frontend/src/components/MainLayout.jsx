import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="w-[16%] overflow-x-auto fixed top-0 left-0 min-w-[200px] max-w-[250px] h-screen border-r">
        <LeftSidebar />
      </div>

      {/* Center Content */}
      <div className="flex-1 flex justify-center ml-[16%] lg:mr-[18%] overflow-x-auto">
        <div className="w-full">
          <Outlet />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[18%] fixed top-0 right-0 min-w-[220px] max-w-[300px] h-screen border-l hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}