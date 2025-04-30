import {useSelector} from 'react-redux'

import styles from "./SideChart.module.scss"
import { useEffect, useRef, useState } from 'react'
import { generateSideChart, maxByCity, top20rain } from './SideChartUtils'
import { IoClose } from "react-icons/io5";



const SideChart = () =>{

    const stations = useSelector(state=>state.station.stations)
    const context = useSelector(state=>state.context.context)
    const map = useSelector((state) => state.map.map)
    const chartInstanceRef = useRef()
    const [menuContext, setMenuContext] = useState('rain.point')
    const [menuLimit, setMenuLimit] = useState(20)
    const [charTitle, setChartTitle] = useState('')

    // const contextsC

    const chartRef = useRef()

    const barClickHandler = item =>{        
        if(map && item){
            if(menuContext === 'rain.point'){
                map.setView([item.latitude, item.longitude], 14)
            } else if(menuContext === 'rain.city'){
                console.log(item);
                
            }
            
        }
    }

    const barHoverHandler = item =>{

    }

    useEffect(_=>{
        switch(menuContext){
            case 'rain.city':
                setChartTitle('Máximo por Cidade')
                break;
            case 'rain.point':
                setChartTitle('Maiores Acumulados')
                break;
            default:
                break;
        }
    },[menuContext])

    useEffect(_=>{
        const start = async _ =>{
            if(stations.length > 0){
                if(context === 'rain'){
                    
                    if(chartInstanceRef.current){                        
                        chartInstanceRef.current.destroy()
                    }

                    if(menuContext === 'rain.point'){
                        let top20 = top20rain(stations)
                        chartInstanceRef.current = await generateSideChart(top20, chartRef.current, barClickHandler, barHoverHandler, 'prefix')
                    } else if(menuContext === 'rain.city'){
                        let byCity = maxByCity(stations).sort((x,y) => y.value - x.value).slice(0,menuLimit)
                        chartInstanceRef.current = await generateSideChart(byCity, chartRef.current, barClickHandler, barHoverHandler, 'city')
                    }
                    
                }
                
            }
        }

        start()
        
    },[stations])

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}><div className={styles.title}>{charTitle}</div><div className={styles.close}><IoClose/></div></div>
            <div className={styles.chartContainer}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}

export default SideChart