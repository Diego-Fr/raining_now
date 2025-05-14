import {useDispatch, useSelector} from 'react-redux'
import {setHours} from '@/store/contextSlice.js'

import styles from './TimeSelector.module.scss'
import { useEffect, useState } from 'react'
import { FaCircleCheck } from "react-icons/fa6";

import moment from 'moment'
import { toast } from 'react-toastify';
import { setEndDate } from '../../store/contextSlice';

const TimeSelector = _=>{

    const dispatch = useDispatch()
    const [block, setBlock] = useState(false)
    const stations = useSelector(state=>state.station.stations)
    const context = useSelector(state=> state.context)
    const stationsLoading = useSelector(state=>state.station.stationsLoading)
    const [customContainerOptions, setCustomContainerOptions] = useState({
        show:false,
        startDate: moment().subtract(24, 'hours').format('DD-MM-YYYY HH:mm'),
        endDate: moment().format('DD-MM-YYYY HH:mm')
    })
    

    let timeoptions = {plu: [1,2,3,6,12,24,48,72,999].reverse()}

    
    
    // const context = useSelector(state=>state.context.context)

    const clickHandler = time =>{
        if(!block){
            if(time != 999){
                setCustomContainerOptions(state=>({
                   ...state,
                   show:false 
                }))
                dispatch(setEndDate({hours: time, endDate: undefined}))
            } else {
                setCustomContainerOptions(state=>({
                    ...state,
                    show: !state.show
                }))
            }
            
        }
    }

    const confirmButtonClick = () =>{
        let startDate = moment(customContainerOptions.startDate, 'DD-MM-YYYY HH:mm')
        let endDate = moment(customContainerOptions.endDate, 'DD-MM-YYYY HH:mm')
        let diff = endDate.diff(startDate, 'h')

        if(diff <= 0 || diff > 72){
            toast.error('Período invalido')
            return ;
        }

        dispatch(setEndDate({hours: diff, endDate}))
        
    }

    const onChangeDate = (field, value) =>{
        // console.log(field, value);
        
        setCustomContainerOptions(state=>({
            ...state,
            [field]:value.target.value
        }))
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
        context.context === 'rain' &&
            <div className={styles.container}>
                <div className={`${styles.customContainer} ${customContainerOptions.show && styles.show}`}>
                    <div className={styles.formGroup}>
                        <label>Inicio</label>
                        <input value={customContainerOptions.startDate} onChange={value=>onChangeDate('startDate', value)}></input>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fim</label>
                        <input value={customContainerOptions.endDate} onChange={value=>onChangeDate('endDate', value)}></input>
                    </div>
                    <button onClick={confirmButtonClick} className={styles.confirmButton}>
                        <FaCircleCheck />
                    </button>
                </div>
                <div className={styles.itemsContainer}>
                    {timeoptions.plu.map((time, index)=> <div key={index} className={`${styles.item} ${context.hours === time && !context.endDate ? styles.active : ''}`} onClick={_=>clickHandler(time)}>{time === 999 ? 'cu' : time}{time === 999 ? '' : time > 1 ? 'hs' : 'h'}</div> )}
                </div>
            </div>
        
    )
}

export default TimeSelector