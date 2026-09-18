import { useEffect, useMemo, useState } from 'react'
import styles from './Legend.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import statesPlu from '@data/statesPlu'
import statesFlu from '@data/statesFlu'
import { setFilterOption } from '../../store/filterSlice'
import statesPPDC from '@data/statesPPDC'
import { useIsMobile } from '../../hooks/isMobile'

const Legend = () =>{
    const context = useSelector(state=> state.context.context)
    const stations = useSelector(state=> state.station.stations)
    const filterOptions = useSelector(state=> state.filter.filterOptions)
    const [states, setStates] = useState([])
    const dispatch = useDispatch()
    const isMobile = useIsMobile()

    
    useEffect(_=>{
        if(context){
            let obj = {}
            switch(context){
                case 'rain':
                    obj = statesPlu
                    break;
                case 'level':
                    obj = statesFlu
                    break;
                case 'ppdc':
                    obj = statesPPDC
                default:
                    break;
            }

            setStates(Object.values(obj).map(x=>({...x, show:true})))            
            
        }
    },[context])

    const itemClickHandler = id =>{
        if(context != 'ppdc'){
            let obj = states.map(state=> 
                id === state.id ? {...state, show: !state.show } : state
            )
    
            setStates(obj)
        }
        
    }

    useEffect(_=>{
        dispatch(setFilterOption({field: 'legend', value: states.filter(x=> x.show).map(x=>x.id)}))
    }, [states])

    //quantos postos caem em cada classificação, respeitando os outros filtros ativos (área, mostrar zerados),
    //mas ignorando o toggle da própria legenda - senão desmarcar uma opção zeraria a contagem dela mesma
    const countByLegend = useMemo(_=>{
        if(context === 'ppdc' || !stations?.length) return {}

        const counts = {}

        stations.forEach(station=>{
            let passes = true

            for(const field in filterOptions){
                if(field === 'legend') continue

                if(field === 'showZero'){
                    if(!filterOptions.showZero && station.value < 1) passes = false
                    continue
                }

                const val = filterOptions[field]
                if(Array.isArray(val) && val.length > 0 && station[field] !== undefined && !val.includes(station[field])){
                    passes = false
                }
            }

            if(passes){
                counts[station.legend] = (counts[station.legend] || 0) + 1
            }
        })

        return counts
    }, [stations, filterOptions, context])


    return (
        <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
            {states.map((state, index)=>
                <div key={index} onClick={_=>itemClickHandler(state.id)} className={styles.legendItem} style={{backgroundColor: state.show ? state.color : 'gray'}}>
                    {state.title}
                    {context !== 'ppdc' && <span className={styles.count}>{countByLegend[state.id] || 0}</span>}
                </div>
            )}
        </div>
    )
}

export default Legend