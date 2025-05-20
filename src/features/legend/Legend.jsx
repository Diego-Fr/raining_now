import { useEffect, useState } from 'react'
import styles from './Legend.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import statesPlu from '@data/statesPlu'
import statesFlu from '@data/statesFlu'
import { setFilterOption } from '../../store/filterSlice'
import statesPPDC from '@data/statesPPDC'

const Legend = () =>{
    const context = useSelector(state=> state.context.context)
    const [states, setStates] = useState([])
    const dispatch = useDispatch()

    
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
    
    
    return (
        <div className={styles.container}>
            {states.map((state, index)=> <div key={index} onClick={_=>itemClickHandler(state.id)} className={styles.legendItem} style={{backgroundColor: state.show ? state.color : 'gray'}}>{state.title}</div> )}
        </div>
    )
}

export default Legend