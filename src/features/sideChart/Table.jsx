import { useEffect, useMemo } from 'react'
import {useSelector} from 'react-redux'
import styles from './Table.module.scss'
import { maxByCity, maxByField } from './SideChartUtils'
import { classifyStation } from '../../utils/stationUtils'
import { locale } from '../../utils/locale'
import statesPlu from '../../data/statesPlu'
import statesFlu from '../../data/statesFlu'

const Table = ({stations,menuContext}) =>{
    
    const context = useSelector(state=> state.context.context)
    // console.log(stations);
    

    
    return <>
        <div className={styles.container}>
            <div className={`${styles.line} ${styles.title}`}>
                <div>{menuContext === 'point' ? 'Prefixo' : menuContext === 'city' ? 'Município' : 'Ugrhi'} </div>
                <div>{context === 'rain' ? 'Valor (mm)' : 'Classificação'}</div>
            </div>
            {
                stations.map((station, index)=>
                    <div key={index} className={styles.line}>
                        <div>{menuContext === 'point' ? station.prefix : menuContext === 'city' ?  station.city : station.ugrhi_name}</div>
                        <div style={{textTransform: 'capitalize'}}>
                            {
                                context === 'rain' ? <span style={{color: statesPlu[station.legend]?.color }}>{station.value.toFixed(2).replace('.',',')}</span>
                                : <span style={{color: statesFlu[station.legend]?.color}}> {locale.t(station.legend)}</span>
                            }
                        </div>
                    </div>
                )
            }
        </div>
    </>
}

export default Table