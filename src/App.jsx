import { useState, lazy, Suspense } from 'react'
import './App.css'
// import Map from './features/map/Map'
import Filter from './features/filter/Filter'

import LayerControl from './features/layer_control/LayerControl'
import TimeSelector from './features/time_selector/TimeSelector'
import Legend from './features/legend/Legend'

import { ToastContainer } from 'react-toastify'
import Loader from './features/loader/Loader'
import Topleft from './features/topleft/Topleft'
import TopRight from './features/topright/TopRight'
import Timeline from './features/timeline/Timeline'


const Map = lazy(_=> import('./features/map/Map'))
const ModalChart = lazy(_=> import('./features/modal_chart/ModalChart'))

const SideChart = lazy(_=> import('./features/sideChart/SideChart'))
const TopLoader = lazy(_=> import('./features/loader/top_loader/TopLoader'))
const ContextMenu = lazy(_=> import('./features/context_menu/ContextMenu'))

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Filter/>
      
      
      <LayerControl/>
      <TimeSelector/>
      
      <Legend/>
      
      <Loader/>
      <Timeline/>
      <Suspense fallback={null}>
        <Map/>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          pauseOnFocusLoss={false}
          theme="dark"
        /> 
        
        <SideChart/>
        <TopLoader/>
        <ContextMenu/>
        <ModalChart/>
      </Suspense>
      
      
      <Topleft/>
      <TopRight/>
      
    </>
  )
}

export default App
