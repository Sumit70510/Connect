import useGetUserProfile from "@/Hooks/useGetUserProfile.jsx";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { AtSign, Heart, MessageCircle } from "lucide-react";

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const isFollowing = true;
  const { userProfile , user } = useSelector((store) => store.auth);
  const [activeTab,setActiveTab] = useState('POSTS');
  const isLoggedInUserProfile = user?._id===userProfile?._id;
  
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 690);
   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 690);
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
    }, []);
  
  const handleTabChange = (tab) => 
   {
    setActiveTab(tab); 
   }
   
  const displayedPost = activeTab==='POSTS'? userProfile?.posts : userProfile?.bookmarks;  
  
  return (
  <div className={`flex h-full justify-center overflow-scroll mx-auto ${isMobile?"":"ml-[16%]"}`}>
    <div className="flex flex-col gap-12 p-8">
    {/* <div className="grid grid-cols-[1fr_2fr]"> */}
    <div className="flex">
     <section className="flex items-center justify-center">
      <Avatar className="h-32 w-32">
        <AvatarImage src={userProfile?.profilePicture} alt="Profile Photo" />
        <AvatarFallback>
          {userProfile?.username?.slice(0, 2)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
     </section>
     <section className="flex items-center">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="font-bold">{userProfile?.username}</span>
          {isLoggedInUserProfile ? (
            <>
              <Link to='/account/edit'>
                <Button className="hover:bg-gray-200 h-8" variant="secondary">
                  Edit Profile
                </Button>
              </Link>
              <Button className="hover:bg-gray-200 h-8" variant="secondary">
                View Archive
              </Button>
              <Button className="hover:bg-gray-200 h-8" variant="secondary">
                Ad Tools
              </Button>
            </>
          ) : isFollowing ? (
            <>
            <Button className="h-8 bg-gray-300 hover:bg-gray-400" variant="secondary">
              Unfollow
            </Button>
            <Button className="h-8 bg-gray-300 hover:bg-gray-400" variant="secondary">
              Message
            </Button>
            </>
          ) : (
            <Button className="h-8 bg-[#0095f6] hover:bg-[#0d6fb1]">
              Follow
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <p className="font-semibold">
            {userProfile?.posts.length||0}
          </p>
          <span>Posts</span>
          <p className="font-semibold">
            {userProfile?.followers.length||0}
          </p>
          <span>Followers</span>
          <p className="font-semibold">
            {userProfile?.following.length||0}
          </p>
          <span>Following</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {userProfile?.bio}
          </span>
          <span className="pl-1">
            <Badge className='w-fit' variant='secondary'><AtSign/>{userProfile?.username}</Badge>
          </span>
          <span className="">
            🧑‍💻 Code With Sumit007
          </span>
          <span className="">
            🧑‍💻 MERN Stack
          </span>
        </div>
        
      </div>
    </section>
   </div>
   
  <div className="border-t border-gray-500">
    <div className="flex items-center justify-center gap-10 text-sm">
      <span className={`py-3 cursor-pointer ${activeTab==='POSTS'?'font-bold':''}`} onClick={()=>handleTabChange('POSTS')}>
        POSTS
      </span>
      <span className={`py-3 cursor-pointer ${activeTab==='SAVED'?'font-bold':''}`} onClick={()=>handleTabChange('SAVED')}>
        SAVED
      </span>
      <span className={`py-3 cursor-pointer ${activeTab==='REELS'?'font-bold':''}`} onClick={()=>handleTabChange('REELS')}>
        REELS
      </span>
      <span className={`py-3 cursor-pointer ${activeTab==='TAGS'?'font-bold':''}`} onClick={()=>handleTabChange('TAGS')}>
        TAGS
      </span>
    </div> 
  </div>
  
   <div className="grid grid-cols-3 gap-3">
     {
      displayedPost?.slice()?.reverse()?.map((post)=>{
        return(
          <div key={post?._id} className="relative group cursor-pointer">
            <img src={post.image} alt='Post Image' className='rounded-sm my-2 w-full aspect-square object-cover'/>
             <div className="absolute my-2 inset-0 flex items-center justify-center bg-black
             opacity-0 transition-opacity duration-300 group-hover:opacity-60 rounded-lg">
              <div className="flex items-center text-white space-x-4">
                <button className="flex items-center text-white gap-2 hover:text-gray-300">
                  <Heart/>
                  <span>{post?.likes.length}</span>
                </button>
                <button className="flex items-center text-white gap-2 hover:text-gray-300">
                  <MessageCircle/>
                  <span>{post?.comments.length}</span>
                </button>
              </div>
            </div>  
          </div>  
        )
      })
     }
   </div>
  
  </div>
</div>
  );
}


