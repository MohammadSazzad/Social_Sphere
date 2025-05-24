import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import LeftSideBar from './components/ui/LeftSideBar.jsx'
import RightSideBar from './components/ui/RightSideBar.jsx'
import CreatePostContainer from './components/ui/CreatePostContainer.jsx'
import Stories from './components/ui/Stories.jsx'
import PostContainer from './components/ui/PostContainer.jsx'
<<<<<<< HEAD
import profile from './users/profile.jsx'
=======
import { useAuthStore } from './store/useAuthStore.js'

>>>>>>> e21aecc0b37b159a306c734a6f9d3bd612c2e97e
function App() {


  return (
      <div className='UiContainer d-flex justify-content-center align-items-center'>
        <div>
          <LeftSideBar />
        </div>
        <div className='MainContainer' >
          <div>
            <CreatePostContainer />
          </div>
          <div>
            <Stories />
          </div>
          <div>
            <PostContainer />
          </div>
          
        </div>
        <div>
          <RightSideBar />
        </div>
      </div>
  )
}

export default App
