import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import MobileUI from './MobileUI';
export default function MainLayout() {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 690);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 690);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
   }, []);


  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar min-w-[200px] max-w-[250px]*/}
     {/* Sidebar / Mobile UI */}
      
      {isMobile ? (
          <MobileUI/>
      ) : ( 
        <>
        <div className="overflow-x-auto fixed top-0 left-0 w-[16%] h-screen border-r min-w-[200px] max-w-[250px]">
          <LeftSidebar />
        </div>
      
         <div className="flex-1 flex justify-center overflow-x-auto">
          <div className="w-full">   
           <Outlet />
          </div>
         </div>
        </>
      )}
      
      

    </div>
  );
}


// import React, { useEffect, useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import LeftSidebar from './LeftSidebar';
// import MobileUI from './MobileUI'; // import your mobile component

// export default function MainLayout() {

//   return (
//     <div className="min-h-screen flex">
      

//       {/* Main Content */}
//       <div
//         className={`flex-1 flex justify-center overflow-x-auto ${
//           isMobile ? 'ml-0 mt-0' : 'ml-[16%]'
//         }`}
//       >
//         <div className="w-full">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import LeftSidebar from './LeftSidebar'

// const MainLayout = () => {
//   return (
//     <div>
//          <LeftSidebar/>
//         <div>
//             <Outlet/>
//         </div>
//     </div>
//   )
// }

// export default MainLayout