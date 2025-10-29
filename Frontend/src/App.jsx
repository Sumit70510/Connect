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

const browserRouter = createBrowserRouter([
     {
      path     : '/',
      element  : <MainLayout/>,
      children : [
          {
           path : '/',
           element : <Home/>}
         ,{
           path : '/profile/:id' ,
           element : <Profile/>
          },
           {
           path  :'/account/edit',
           element : <EditProfile/>
           },
           {
            path  :'/chat',
            element : <ChatPage/>
           }    
        ] }
    ,{
      path    : '/login',
      element : <Login/> }
    ,{
      path    :'/signup',
      element : <Signup/> 
     },
         {
          path  :'/chat',
          element : <ChatPage/>
          }
     
 ])

function App() {
  
  const {user} = useSelector(store=>store.auth);
  const dispatch = useDispatch();
  
  useEffect(()=>{
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
      } 
     return () => {
       if(socketio) 
        {
         socketio.off('getOnlineUsers'); 
         socketio.close(); 
         dispatch(setSocket(null));
        } 
      };
  },[user,dispatch]);
  
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
