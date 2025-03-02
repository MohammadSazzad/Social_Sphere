<<<<<<< HEAD
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './users/signUp.jsx';
import VerifyUser from './users/VerifyUser.jsx';
import Layout from './Layout.jsx';
import Login from './users/login.jsx';
import App from './App.jsx';
import Profile from './users/Profile.jsx';
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './users/signUp.jsx'
import VerifyUser from './users/VerifyUser.jsx'
import Layout from './Layout.jsx'
import Login from './users/login.jsx'
import App from './App.jsx'
import ContextProvider from './store/ContextProvider.jsx'
import CreateStory from './pages/CreateStory.jsx'
>>>>>>> ca411e8a8c47350499673dbe347fca75039b8347

const isToken = localStorage.getItem('token');

const router = createBrowserRouter(
  createRoutesFromElements(
<<<<<<< HEAD
    <Route path='/' element={<Layout />}>
      {isToken ? (
        <>
          <Route path='feed' element={<App />} />
          <Route path='profile/:userId' element={<Profile />} />
          <Route path='' element={<Navigate to='/feed' />} />
        </>
      ) : (
        <Route path='' element={<Login />} />
      )}
      <Route path='users'>
        <Route path='signup' element={<SignUp />} />
        <Route path='verification' element={<VerifyUser />} />
=======
    <Route path='/' element= {<Layout />} >
      {isToken? 
      <Route path='' element = { <App /> } /> : 
      <Route path='' element = { <Login /> } />  
    }
      <Route path='users' >
        <Route path='signup' element={<SignUp/>}/>
        <Route path='verification' element={<VerifyUser/>}/>
      </Route> 
      <Route path = 'story' >
        <Route path = 'create' element = { <CreateStory/> }/>
>>>>>>> ca411e8a8c47350499673dbe347fca75039b8347
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <RouterProvider router={router} />
  </StrictMode>
);
=======
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
)

>>>>>>> ca411e8a8c47350499673dbe347fca75039b8347
