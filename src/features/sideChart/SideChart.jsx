import {useDispatch, useSelector} from 'react-redux'

import styles from "./SideChart.module.scss"
import { useEffect, useMemo, useRef, useState } from 'react'
import { generateSideChart, maxByCity, maxByField, top20rain } from './SideChartUtils'
import { IoClose, IoChevronForward } from "react-icons/io5";
import Table from './Table';
import ContextSelector from './ContextSelector'
import { classifyStation } from '../../utils/stationUtils';
import { setShow } from '../../store/sideMenuSlice';



const SideChart = () =>{
    const dispatch = useDispatch()
    const stationsOptions = useSelector(state=>state.station)
    const context = useSelector(state=>state.context.context)
    const map = useSelector((state) => state.map.map)
    const chartInstanceRef = useRef()
    const [menuContext, setMenuContext] = useState('point')
    const [menuLimit, setMenuLimit] = useState(20)
    const [charTitle, setChartTitle] = useState('')
    const sidemenu = useSelector(state=>state.sidemenu)
    
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

    //editando o titulo do contexto do sidebar
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
        } else if(context === 'level'){            
            setChartTitle('Classificação Fluviometria')
        }
        
    },[menuContext,context])

    //useMemo no stations, para criar uma lista de postos com contexto validos para plu e flu:
    //plu apenas os top 20 com valores >= 1 e filtrados atualmente
    //flu 20 postos. apenas os com classificação diferente de normal 
    const topStations = useMemo(_=>{
        if(context === 'rain'){
            if(menuContext === 'point'){
                return stationsOptions.stations?.slice().filter(x=>x.show).sort((x,y)=>y.value-x.value).slice(0,20) || []
            } else if(menuContext === 'city') {
                return maxByField(stationsOptions.stations.filter(x=>x.show), 'city').sort((x,y) => y.value - x.value).slice(0,20)
            } else if(menuContext === 'ugrhi') {
                return maxByField(stationsOptions.stations.filter(x=>x.show), 'ugrhi_name').sort((x,y) => y.value - x.value)
            }
            
        } else if(context === 'level'){            
            return stationsOptions.stations?.slice().filter((x)=>classifyStation(x, context).legend != 'normal').slice(0,20) || []
        }
        return []
        
    }, [stationsOptions.stations, context, menuContext])

    useEffect(_=>{
        if(context === 'rain'){
            setExibitionType('chart')
        } else if(context === 'level'){
            setExibitionType('table')
            setMenuContext('point')
        }
    }, [context])


    //criando os gráficos baseado no contexto.
    //poderia sim ser um componente separado
    useEffect(_=>{
        const start = async _ =>{
            if(topStations.length > 0){
                if(context === 'rain' && exibitionType === 'chart' && chartRef.current){
                    
                    if(chartInstanceRef.current){                        
                        chartInstanceRef.current.destroy()
                    }

                    chartInstanceRef.current = await generateSideChart(
                        topStations, 
                        chartRef.current, 
                        barClickHandler, 
                        undefined, 
                        menuContext === 'point' ? 'prefix' : menuContext === 'city' ? 'city' : 'ugrhi_name'
                    )
                    
                }
                
            }
        }

        start()
        
    },[topStations, exibitionType,menuContext])    

    const closeClick = () =>{
        dispatch(setShow(false))
    }

    return (
        <div className={`${styles.container} ${sidemenu.show ? styles.show : ''}`}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {/* titulo do sidebar */}
                    <div className={styles.text}>{charTitle}</div>

                    {/* next button */}
                    { context === 'rain' &&
                        <div className={styles.next} onClick={nextContext}><IoChevronForward/></div> }
                </div>

                {/* close button */}
                <div className={styles.close} onClick={closeClick}><IoClose/></div>
            </div>
            
            <div className={styles.chartContainer}>
                
                {/* seletor de contexto do sidebar */}
                <ContextSelector menuContext={menuContext} setExibitionType={setExibitionType}/>

                { topStations?.length === 0 ?
                    <div style={{flex:1, display:'flex', alignItems: 'center', justifyContent: 'center'}}>{stationsOptions.stationsLoading ? 'Carregando Dados' : 'Sem dados disponíveis' }</div>
                    : exibitionType === 'chart' ? 
                        <canvas ref={chartRef}></canvas>
                        :<Table stations={topStations} menuContext={menuContext}/>
                }

            </div>
        </div>
    )
}

export default SideChart