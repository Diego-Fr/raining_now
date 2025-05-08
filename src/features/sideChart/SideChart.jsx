import {useSelector} from 'react-redux'

import styles from "./SideChart.module.scss"
import { useEffect, useRef, useState } from 'react'
import { generateSideChart, maxByCity, maxByField, top20rain } from './SideChartUtils'
import { IoClose } from "react-icons/io5";
import Table from './Table';
import ContextSelector from './ContextSelector'



const SideChart = () =>{

    const stations = useSelector(state=>state.station.stations)
    const context = useSelector(state=>state.context.context)
    const map = useSelector((state) => state.map.map)
    const chartInstanceRef = useRef()
    const [menuContext, setMenuContext] = useState('ugrhi')
    const [menuLimit, setMenuLimit] = useState(20)
    const [charTitle, setChartTitle] = useState('')
    
    const menuContextAvailables = {
        rain: ['point', 'city', 'ugrhi']
    }

    const [exibitionType, setExibitionType] = useState('chart')

    const chartRef = useRef()

    const barClickHandler = item =>{        
        if(map && item){
            if(menuContext === 'point'){
                map.setView([item.latitude, item.longitude], 14)
            } else if(menuContext === 'city'){
                //zoom no muni e exibir limites                
            }
        }
    }

    const nextContext = () =>{
        let index = menuContextAvailables[context].indexOf(menuContext)
        if(menuContextAvailables[context][index+1]){
            setMenuContext(menuContextAvailables[context][index+1])
        } else {
            setMenuContext(menuContextAvailables[context][0])
        }
    }

    const barHoverHandler = item =>{

    }

    useEffect(_=>{
        if(context === 'rain'){
            switch(menuContext){
                case `city`:
                    setChartTitle('Máximo por Cidade')
                    break;
                case 'point':
                    setChartTitle('Maiores Acumulados')
                    break;
                case 'ugrhi':
                    setChartTitle('Máximo por Ugrhi')
                    break;
                default:
                    break;
            }
        }
        
    },[menuContext])

    useEffect(_=>{
        const start = async _ =>{
            if(stations.length > 0){
                if(context === 'rain' && exibitionType === 'chart'){
                    
                    if(chartInstanceRef.current){                        
                        chartInstanceRef.current.destroy()
                    }

                    if(menuContext === 'point'){
                        let top20 = top20rain(stations)
                        chartInstanceRef.current = await generateSideChart(top20, chartRef.current, barClickHandler, barHoverHandler, 'prefix')
                    } else if(menuContext === 'city'){
                        let byCity = maxByCity(stations).sort((x,y) => y.value - x.value).slice(0,menuLimit)
                        chartInstanceRef.current = await generateSideChart(byCity, chartRef.current, barClickHandler, barHoverHandler, 'city')
                    } else if(menuContext === 'ugrhi'){
                        let byUgrhi = maxByField(stations, 'ugrhi_name').sort((x,y) => y.value - x.value)
                        chartInstanceRef.current = await generateSideChart(byUgrhi, chartRef.current, barClickHandler, barHoverHandler, 'ugrhi_name')
                    }
                    
                }
                
            }
        }

        start()
        
    },[stations, exibitionType,menuContext])

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}><div className={styles.title}><div className={styles.text}>{charTitle}</div><div className={styles.next} onClick={nextContext}>></div></div><div className={styles.close}><IoClose/></div></div>
            
            <div className={styles.chartContainer}>
                <ContextSelector setExibitionType={setExibitionType}/>
                {  exibitionType === 'chart' ?
                     <canvas ref={chartRef}></canvas> : 
                     <Table stations={stations} menuContext={menuContext}/>
                }
            </div>
        </div>
    )
}

export default SideChart