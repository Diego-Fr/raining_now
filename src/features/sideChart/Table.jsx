import { useMemo } from 'react'
import {useSelector} from 'react-redux'
import styles from './Table.module.scss'
import { maxByCity, maxByField } from './SideChartUtils'

const Table = ({stations,menuContext}) =>{
    
    const context = useSelector(state=> state.context.context)

    const topStations = useMemo(_=>{
        if(context === 'rain'){
            if(menuContext === 'point'){
                return stations?.slice().sort((x,y)=>y.value-x.value).slice(0,20) || []
            } else if(menuContext === 'city') {
                return maxByCity(stations).sort((x,y) => y.value - x.value).slice(0,20)
            } else if(menuContext === 'ugrhi') {
                return maxByField(stations, 'ugrhi_name').sort((x,y) => y.value - x.value)
            }
            
        } 
        return []
        
        
    }, [stations,context,menuContext])

    
    return <>
        <div className={styles.container}>
            <div className={`${styles.line} ${styles.title}`}><div>Prefixo</div><div>Valor</div></div>
            {
                topStations.map((station, index)=>
                    <div key={index} className={styles.line}>
                        <div>{menuContext === 'point' ? station.prefix : menuContext === 'city' ?  station.city : station.ugrhi_name}</div>
                        <div>{station.value.toFixed(2)}</div>
                    </div>
                )
            }
        </div>
    </>
}

export default Table