import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import LeftSideBar from './components/ui/LeftSideBar.jsx'
import RightSideBar from './components/ui/RightSideBar.jsx'

function App() {

  return (
    <>
      <div className='UiContainer d-flex justify-content-between align-items-center'>
        <LeftSideBar />
        <div>
          <h1>Content</h1>
        </div>
        <RightSideBar />
      </div>
    </>
  )
}

export default App
