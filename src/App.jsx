import { useState, lazy, Suspense, useEffect } from 'react'
import './App.css'
// import Map from './features/map/Map'
import Filter from './features/filter/Filter'

import LayerControl from './features/layer_control/LayerControl'
import TimeSelector from './features/time_selector/TimeSelector'
import Legend from './features/legend/Legend'

import { ToastContainer } from 'react-toastify'
import Loader from './features/loader/Loader'
import Topleft from './features/panels/topleft/Topleft'
import TopRight from './features/panels/topright/TopRight'
import Timeline from './features/timeline/Timeline'
import LoginComponent from './features/login/LoginComponent'

import {useDispatch, useSelector} from 'react-redux'
import { getMeData, setExpires, setToken } from './store/authSlice'
import { isLogged } from './utils/authUtils'
import Lightning from './features/lightning/Lightning'
import BottomRight from './features/panels/bottomright/BottomRIght'

const Map = lazy(_=> import('./features/map/Map'))
const ModalChart = lazy(_=> import('./features/modal_chart/ModalChart'))

const SideChart = lazy(_=> import('./features/sideChart/SideChart'))
const TopLoader = lazy(_=> import('./features/loader/top_loader/TopLoader'))
const ContextMenu = lazy(_=> import('./features/context_menu/ContextMenu'))

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch()
  const authOptions = useSelector(state=> state.auth)

  useEffect(() => {
    const token = localStorage.getItem('sibh_user_token');
    const exp = localStorage.getItem('sibh_user_expires');
    
    dispatch(setToken(token))
    dispatch(setExpires(exp))
  }, []);

  useEffect(_=>{
    if(authOptions.token){
      dispatch(getMeData(authOptions.token))
    }
  },[authOptions.token])

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
          autoClose={3000}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          theme="light"
        /> 
        
        <SideChart/>
        <TopLoader/>
        <ContextMenu/>
        <ModalChart/>
        <LoginComponent/>
        <Lightning></Lightning>
        
      </Suspense>
      
      
      <Topleft/>
      <TopRight/>
      <BottomRight/>
      
    </>
  )
}

export default App
