import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './users/signUp.jsx'
import VerifyUser from './users/VerifyUser.jsx'
import Layout from './Layout.jsx'
import Login from './users/login.jsx'
import App from './App.jsx'
import ContextProvider from './store/ContextProvider.jsx'
import CreateStory from './pages/CreateStory.jsx'
import ShowStory from './pages/ShowStory.jsx'
import Messenger from './pages/Messenger.jsx'
import { ProtectedRoute } from './lib/ProtectRoute.jsx'
import { AuthRedirect } from './lib/AuthRedirect.jsx'
import Profile from './users/Profile.jsx';
import Gaming from './components/Gaming/Gaming.jsx'
import Chess from './pages/chess.jsx'
import Ludo from './pages/Ludo.jsx'
import Uno from './pages/Uno.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      }/>
      
      <Route path='login' element={
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      }/>
        <Route path='gaming' element={
    <ProtectedRoute>
      <Gaming />
    </ProtectedRoute>
  }/>
  <Route path="/gaming/chess" element={<Chess />} />
      <Route path='profile/:userId' element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
      <Route path="/gaming/ludo" element={<Ludo />} />
      <Route path="/gaming/Uno" element={<Uno/>} />
      <Route path='users'>
        <Route path='signup' element={
          <AuthRedirect>
            <SignUp />
          </AuthRedirect>
        }/>
        <Route path='verification' element={
          <AuthRedirect>
             <VerifyUser/>
          </AuthRedirect>
          }/>
      </Route>

      <Route path='story' >
        <Route path='create' element={
          <ProtectedRoute>
            <CreateStory/>
          </ProtectedRoute>
        }/>
        <Route path='viewStory/:id' element={<ShowStory />}/> 
      </Route>
      <Route path='message' element={
        <ProtectedRoute>
          <Messenger />
        </ProtectedRoute>
      }/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
)

