import {useDispatch, useSelector} from 'react-redux'
import {setHours} from '@/store/contextSlice.js'

import styles from './TimeSelector.module.scss'
import { useEffect, useState } from 'react'

const TimeSelector = _=>{

    const dispatch = useDispatch()
    const [block, setBlock] = useState(false)
    const stations = useSelector(state=>state.station.stations)
    let timeoptions = {plu: [1,2,3,6,12,24,48,72]}

    const clickHandler = time =>{
        if(!block){
            dispatch(setHours(time))
            setBlock(true)
        }
    }

    useEffect(_=>{
        setBlock(false)
    },[stations])

    return (
        <div className={styles.container}>
            {timeoptions.plu.map((time, index)=> <div key={index} className={styles.item} onClick={_=>clickHandler(time)}>{time}</div> )}
        </div>
    )
}

export default TimeSelector