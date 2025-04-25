import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './features/map/Map'
import Filter from './features/filter/Filter'
import ContextMenu from './features/context_menu/ContextMenu'
import LayerControl from './features/layer_control/LayerControl'
import TimeSelector from './features/time_selector/TimeSelector'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Filter/> */}
      <Map/>
      <ContextMenu/>
      <LayerControl/>
      <TimeSelector/>
    </>
  )
}

export default App
