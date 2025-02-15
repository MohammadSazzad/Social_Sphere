import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import LeftSideBar from './components/ui/LeftSideBar.jsx'
import RightSideBar from './components/ui/RightSideBar.jsx'
import CreatePostContainer from './components/ui/CreatePostContainer.jsx'

function App() {

  return (
      <div className='UiContainer d-flex justify-content-center align-items-center'>
        <div>
          <LeftSideBar />
        </div>
        <div className='MainContainer'>
          <CreatePostContainer />
        </div>
        <div>
          <RightSideBar />
        </div>
      </div>
  )
}

export default App
