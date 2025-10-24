import Login from './components/Login.jsx'
import Signup from './components/signup.jsx';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import { RouterProvider } from 'react-router-dom';
import EditProfile from './components/EditProfile.jsx';
import ChatPage from './components/ChatPage.jsx';
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

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
