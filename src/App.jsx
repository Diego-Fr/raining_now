import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './features/map/Map'
import Filter from './features/filter/Filter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Filter/>
      <Map/>
    </>
  )
}

export default App
