import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/Redux/authslice';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { Button } from './ui/button';
import axios from 'axios';
import { setMessages } from '@/Redux/chatSlice';
import { toast } from 'sonner';

export default function ChatPage() {  
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);  
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 690);
  
  const sendMessageHandler = async (recieverId) => {
    if (!textMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    try {
      const res = await axios.post(`/api/v1/message/send/${recieverId}`,
        { message: textMessage },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...(Array.isArray(messages) ? messages : []), res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 690);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      dispatch(setSelectedUser(null));
      setTextMessage("");
    };
  }, []); 

  return (
    <div className={`flex overflow-hidden m-0 p-1 h-screen ${isMobile ? "" : "ml-[16%]"}`}>
      {!isMobile && (
        <section className="w-full md:w-1/4 my-8 border-r border-gray-300 overflow-y-auto">
          <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
          <hr className="mb-4 border-gray-300" />
          <div className="overflow-y-auto h-[80vh]">
            {suggestedUsers?.map((suggestedUser) => {
              const isOnline = onlineUsers?.includes(suggestedUser?._id);
              return (
                <div
                  key={suggestedUser._id}
                  className="flex gap-3 items-center p-3 hover:bg-gray-300 cursor-pointer"
                  onClick={() => {
                    dispatch(setSelectedUser(suggestedUser));
                    setSelected(suggestedUser);
                  }}
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={suggestedUser?.profilePicture} alt="Profile_image" />
                    <AvatarFallback>{suggestedUser?.username?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{suggestedUser?.username}</span>
                    <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'} font-bold`}>
                      {isOnline ? 'online' : 'offline'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!isMobile ? (
  selectedUser ? (
    <section className="flex flex-col flex-1 h-full justify-between">
      <div className="flex gap-3 items-center px-3 py-2 mt-1 sticky top-0 border-b border-gray-300 bg-white">
        <Avatar className="w-14 h-14">
          <AvatarImage src={selectedUser?.profilePicture} alt="Profile_image" />
          <AvatarFallback>
            {selectedUser?.username?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{selectedUser?.username}</span>
        </div>
      </div>

      <Messages selectedUser={selectedUser} />

      <div className="flex items-center py-4 border-t border-t-gray-300 px-2">
        <input
          type="text"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="flex-1 ml-2 mr-2 focus-visible:ring-transparent border rounded-lg px-2 py-1"
          placeholder="Type your message here..."
        />
        <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="mr-1">
          Send
        </Button>
      </div>
    </section>
  ) : (
    <div className="flex flex-col flex-1 items-center justify-center mx-auto">
      <MessageCircleCode className="w-32 h-32 my-4" />
      <h1 className="font-medium text-xl">Your Messages</h1>
      <span>Send a message to start chat</span>
    </div>
  )
) : (
<div className="w-screen h-full">
  {!selectedUser ? (
    <section className="flex flex-col h-full w-full px-3 overflow-x-hidden overflow-y-scroll bg-white">
      <h1 className="font-bold mb-4 px-3 text-xl mt-4">{user?.username}</h1>
      <hr className="mb-4 border-gray-300" />
      {suggestedUsers?.map((suggestedUser) => {
        const isOnline = onlineUsers?.includes(suggestedUser?._id);
        return (
          <>
          <div
            key={suggestedUser._id}
            className="flex gap-3 items-center p-3 hover:bg-gray-200 cursor-pointer w-full"
            onClick={() => dispatch(setSelectedUser(suggestedUser))}
          >
            <Avatar className="w-14 h-14">
              <AvatarImage src={suggestedUser?.profilePicture} alt="Profile_image" />
              <AvatarFallback>
                {suggestedUser?.username?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{suggestedUser?.username}</span>
              <span
                className={`text-xs ${
                  isOnline ? "text-green-600" : "text-red-600"
                } font-bold`}
              >
                {isOnline ? "online" : "offline"}
              </span>
            </div>
          </div>
          <hr className="w-full border-gray-300" />
          </>
        );
      })}
    </section>
  ) : (

    <section className="flex flex-col h-full justify-between bg-white">
      <div className="flex gap-3 items-center px-3 py-2 sticky top-0 border-b border-gray-300 bg-white z-9">
        <button
          className="text-lg font-bold mr-2"
          onClick={() => dispatch(setSelectedUser(null))}
        >
          ←
        </button>
        <Avatar className="w-12 h-12">
          <AvatarImage src={selectedUser?.profilePicture} alt="Profile_image" />
          <AvatarFallback>
            {selectedUser?.username?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{selectedUser?.username}</span>
        </div>
      </div>

      <Messages selectedUser={selectedUser} />

      <div className="flex fixed items-center py-3 bottom-12 border-t border-t-gray-300 px-2 bg-white w-full">
        <input
          type="text"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="flex-1 ml-2 mr-2 focus-visible:ring-transparent border rounded-lg px-2 py-1"
          placeholder="Type your message here..."
        />
        <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="mr-1">
          Send
        </Button>
      </div>
    </section>
  )}
</div>

)}

    </div>
  );
}
