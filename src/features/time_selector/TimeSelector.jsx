import {useDispatch, useSelector} from 'react-redux'
import {setHours} from '@/store/contextSlice.js'

import styles from './TimeSelector.module.scss'
import { useEffect, useState } from 'react'

const TimeSelector = _=>{

    const dispatch = useDispatch()
    const [block, setBlock] = useState(false)
    const stations = useSelector(state=>state.station.stations)
    const hours = useSelector(state=> state.context.hours)
    const stationsLoading = useSelector(state=>state.station.stationsLoading)
    const [customContainerOptions, setCustomContainerOptions] = useState({
        show:false
    })
    let timeoptions = {plu: [1,2,3,6,12,24,48,72,999].reverse()}

    
    
    const context = useSelector(state=>state.context.context)

    const clickHandler = time =>{
        if(!block){
            if(time != 999){
                dispatch(setHours(time))
            } else {
                setCustomContainerOptions(state=>({
                    ...state,
                    show: !state.show
                }))
            }
            
        }
    }

    //analisando se esta carregando, e bloqueando a seleção de outro período enquanto carrega
    useEffect(_=>{
        if(stationsLoading){
            setBlock(true)
        } else {
            setBlock(false)
        }
        
    }, [stationsLoading])

    return (
        context === 'rain' &&
            <div className={styles.container}>
                <div className={`${styles.customContainer} ${customContainerOptions.show && styles.show}`}>
                    <div className={styles.formGroup}>
                        <label>Inicio</label>
                        <input value={'inicio'}></input>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fim</label>
                        <input value={'fim'}></input>
                    </div>
                </div>
                <div className={styles.itemsContainer}>
                    {timeoptions.plu.map((time, index)=> <div key={index} className={`${styles.item} ${hours === time ? styles.active : ''}`} onClick={_=>clickHandler(time)}>{time === 999 ? 'cu' : time}{time === 999 ? '' : time > 1 ? 'hs' : 'h'}</div> )}
                </div>
            </div>
        
    )
}

export default TimeSelector