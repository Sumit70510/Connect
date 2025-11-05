import Login from './components/Login.jsx'
import Signup from './components/signup.jsx';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import { RouterProvider } from 'react-router-dom';
import EditProfile from './components/EditProfile.jsx';
import ChatPage from './components/ChatPage.jsx';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSocket } from './Redux/socketSlice.js';
import { setOnlineUsers } from './Redux/chatSlice.js';
import { setLikeNotification } from './Redux/rtnSlice.js';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import dotenv from 'dotenv';
// dotenv.config();
const browserRouter = createBrowserRouter([
     {
      path     : '/',
      element  : <ProtectedRoutes>
                   <MainLayout/>
                 </ProtectedRoutes>,
      children : [ 
          {
           path : '/',
           element : 
                    <ProtectedRoutes>
                      <Home/> 
                    </ProtectedRoutes>
          }
         ,{
           path : '/profile/:id' ,
           element : 
                    <ProtectedRoutes>
                      <Profile/>
                    </ProtectedRoutes>
          },
           {
           path  :'/account/edit',
           element : 
                   <ProtectedRoutes> 
                     <EditProfile/>
                   </ProtectedRoutes>
           },
           {
            path  :'/chat',
            element : 
                    <ProtectedRoutes>
                      <ChatPage/>
                    </ProtectedRoutes>
           }    
      ]}
    ,{
      path    : '/login',
      element : <Login/> }
    ,{
      path    :'/signup',
      element : <Signup/> 
     },      
  ]);

function App() {
  
  const {user} = useSelector(store=>store.auth);
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);
  
  useEffect(()=>
  {
    if(user)
     {
       const socketio = io('http://localhost:8000',
         {query : {
           userId : user?._id
         } ,
         transports : ['websocket']
       });
       
       dispatch(setSocket(socketio));
       socketio.on('getOnlineUsers',(onlineUsers)=>{
         dispatch(setOnlineUsers(onlineUsers));
       });
       
       socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
       });

       
       return () => {
        socketio.off('getOnlineUsers'); 
        socketio.off('notification'); 
        socketio.close(); 
        dispatch(setSocket(null));
      }
      }
    else
      if(socket)
       {  
         return () => {
          socket.off('getOnlineUsers'); 
          socket.off('notification'); 
          socket.close(); 
         dispatch(setSocket(null));
          }
       } 
   },[user,dispatch]);
   
   
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App;
