import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './users/signUp.jsx'
import VerifyUser from './users/VerifyUser.jsx'
import Layout from './Layout.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element= {<Layout />} >
      <Route path='users' >
        <Route path='signup' element={<SignUp/>}/>
        <Route path='verification' element={<VerifyUser/>}/>
      </Route> 
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
