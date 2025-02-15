import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import LeftSideBar from './components/ui/LeftSideBar.jsx'
import RightSideBar from './components/ui/RightSideBar.jsx'
import CreatePostContainer from './components/ui/CreatePostContainer.jsx'

function App() {

  return (
      <div className='UiContainer d-flex justify-content-between align-items-center'>
        <LeftSideBar />
        <div>
          <CreatePostContainer />
        </div>
        <RightSideBar />
      </div>
  )
}

export default App
