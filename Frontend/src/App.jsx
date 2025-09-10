import Login from './components/Login.jsx'
import Signup from './components/signup.jsx';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import { RouterProvider } from 'react-router-dom';

const browserRouter = createBrowserRouter([
     {
      path     : '/',
      element  : <MainLayout/>,
      children : [
          {
           path : '/',
           element : <Home/>}
         ,{
           path : '/profile' ,
           element : <Profile/>
          } ] }
    ,{
      path    : '/login',
      element : <Login/> }
    ,{
      path    :'/signup',
      element : <Signup/> 
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
