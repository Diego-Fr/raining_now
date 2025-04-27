import { useEffect, useRef, useState } from 'react'
import styles from './ModalChart.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import { fetchStationMeasurements } from '../../services/api'

import DatePicker from './DatePicker'
import { generatePluChart } from './ModalChartUtils'
import { setEndDate, setStartDate } from '../../store/modalChartSlice'
import Loading from './Loading'





const ModalChart = () =>{

    const [show, setShow] = useState(false)
    const [mapContainerSize, setMapContainerSize] = useState(500)
    const chartRef = useRef()
    const chartInstanceRef = useRef()
    const counter = useSelector(state=>state.modalchart.counter)
    const chartOptions = useSelector(state=>state.modalchart)
    const titleRef = useRef()
    const wrapperRef = useRef()
    const stations = useSelector(state=> state.station.stations)
    const [stationName, setStationName] = useState()
    const [stationPrefix, setStationPrefix] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)

    const [measurements, setMeasurements] = useState([])

    const startDate = useSelector(state=> state.modalchart.start_date)
    const endDate = useSelector(state=> state.modalchart.end_date)

    const dispatch = useDispatch()
    
    

    const setMapTitle = (station_id) =>{
        let station = stations.find(x=> x.station_prefix_id.toString() === station_id.toString())

        setStationName(station.station_name)
        setStationPrefix(station.prefix)
        
    }

    const getMeasurements = async _ =>{
        
        if(counter != 1){

            setShow(true)
            setIsLoading(true)
            setChartSize()
 
            if(chartInstanceRef.current){
                chartInstanceRef.current.destroy()
            }        
            
            setMapTitle(chartOptions.station_id)

            let res = await fetchStationMeasurements(chartOptions.station_id, {start_date: startDate.format('YYYY-MM-DD HH:mm'), end_date: endDate.format('YYYY-MM-DD HH:mm')})

            setMeasurements(res)
            
            setIsLoading(false)
        }
    }
    
    const zoomEventHandle = _ =>{
        console.log('toa qui');
        
        setIsZoomed(true)
    }

    const generateChart = async _ =>{
        if(counter != 1){
            chartInstanceRef.current = await generatePluChart(measurements, chartRef.current, zoomEventHandle) 
        }                  
    }

    const setChartSize = async () =>{
        
        await new Promise(resolve => setTimeout(resolve, 1)) //workaround

        setMapContainerSize(wrapperRef.current.offsetHeight - titleRef.current.offsetHeight) 
    }

    useEffect(_=>{
        if(!isLoading){            
            generateChart()
        }
    }, [isLoading])

    useEffect(_=>{
        dispatch(setStartDate())
        dispatch(setEndDate())
        // generateChart()
    }, [counter])

    useEffect(_=>{
        getMeasurements()
        
    }, [startDate, endDate])

    const outsideClick = () =>{
        setShow(false)
    }

    const resetChartZoom = () =>{
        setIsZoomed(false)
        chartInstanceRef.current.resetZoom()
    }

    return (
        <div onClick={_=>{outsideClick()}} className={`${styles.container} ${show ? styles.show : ''}`}>
            <div onClick={e=>e.stopPropagation()} className={styles.wrapper} ref={wrapperRef}>
                <div ref={titleRef} className={styles.title_container}>
                    <div className={styles.title}><div>{stationName}</div><div className={styles.prefix}>{stationPrefix}</div></div>
                    <DatePicker/>
                </div>
                <div className={styles.body} style={{height: mapContainerSize}}>
                    {isLoading ? 
                        <Loading text="Carregando"/> : 
                        <>
                            <canvas ref={chartRef}></canvas>
                            {isZoomed && <button className={styles.resetZoomButton} onClick={_=>{resetChartZoom(false)}}>Remover Zoom</button>}
                        </>
                        }
                </div>
            </div>
        </div>
    )
}

export default ModalChart