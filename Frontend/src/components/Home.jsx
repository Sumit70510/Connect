// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Feed from './Feed.jsx';
// import useGetAllPost from '@/Hooks/useGetAllPost.jsx';
// import useGetSuggestedUsers from '@/Hooks/useGetSuggestedUsers.jsx';

// export default function Home() {
//   useGetAllPost();
//   useGetSuggestedUsers();
//   return (
//     <div className='flex'>
//       <div className='flex-grow'>
//         <Feed/>
//         <Outlet/>
//       </div> 
//     </div>
//   )
// }

import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers(); 
    return (
        <div className='flex'>
            <div className='grow'>
                <Feed />
                <Outlet />
            </div>
            <div className='w-[18%] fixed top-0 right-0 min-w-[220px] max-w-[300px] h-screen border-l hidden lg:block'>
              <RightSidebar />
            </div>
        </div>
    )
}

export default Home