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

const isToken = localStorage.getItem('token');

const router = createBrowserRouter(
  createRoutesFromElements(
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
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
)

