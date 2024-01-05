import './App.css'
import { TopBar } from './components/TopBar'
import { StatsMenu } from './components/StatsMenu'
import Canvas from './components/Canvas'

function App() {
  
  return (
    <>
      <div className="topBarDiv">
        <TopBar/>
      </div>

      <div className="statsMenuDiv">
        <StatsMenu/>
      </div>

      <div className="canvasDiv">
        <Canvas/>
      </div>
    </>
  )
}

export default App
