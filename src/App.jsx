import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './features/map/Map'
import Filter from './features/filter/Filter'
import ContextMenu from './features/context_menu/ContextMenu'
import LayerControl from './features/layer_control/LayerControl'
import TimeSelector from './features/time_selector/TimeSelector'
import ModalChart from './features/modal_chart/ModalChart'
import Legend from './features/legend/Legend'
import SideChart from './features/sideChart/SideChart'
import { ToastContainer } from 'react-toastify'
import Loader from './features/loader/Loader'
import Timeline from './features/timeline/Timeline'
import Topleft from './features/topleft/Topleft'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Filter/>
      <Map/>
      <ContextMenu/>
      <LayerControl/>
      <TimeSelector/>
      <ModalChart/>
      <Legend/>
      <ToastContainer
          position="bottom-right"
          autoClose={2000}
          pauseOnFocusLoss={false}
          theme="dark"
      /> 
      <Loader/>
      <Timeline/>
      <Topleft/>
      {/* <SideChart/> */}
    </>
  )
}

export default App
