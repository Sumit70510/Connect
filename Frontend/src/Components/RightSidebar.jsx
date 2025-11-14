import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { Link } from 'react-router';
import SuggestedUsers from './SuggestedUsers.jsx';

export default function RightSidebar() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className='w-fit my-10 p-2 pl-6 pr-6'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col w-[140px]">
          <Link
            className='font-semibold text-xs truncate'
            to={`/profile/${user?._id}`}
          >
            {user?.username}
          </Link>

          {/* 👉 Trimmed bio, 1 line only */}
          <span className='text-gray-600 text-xs truncate max-w-[130px]'>
            {user?.bio || "No bio"}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
}
