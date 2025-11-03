import { useEffect, useRef, useState } from 'react'
import styles from './Topleft.module.scss'
import { FaFilter } from "react-icons/fa6";
import { FaInfo, FaTimes } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'
import { setFilterFormOption } from '../../../store/filterSlice';

import { setShow } from '../../../store/radarSlice';
import { setShow as setShowSidemenu } from '../../../store/sideMenuSlice'
import { GiRadarDish } from "react-icons/gi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { setShow as setLightningShow } from '../../../store/lightningSlice';
import spaguaslogocolored from '@assets/logo_chuva_agora.png'





const Topleft = () =>{
    const dispatch = useDispatch()
    const filterFormOptions = useSelector(state=>state.filter.filterFormOptions)
    const radarOptions = useSelector(state=>state.radar)
    const lightningOptions = useSelector(state=>state.lightning)
    
    const radarShow = useRef(false)
    const lightningShow = useRef(false)
    const showFilter = useRef(false)
    
    const [items, setItems] = useState({
        filter: {id: 'filter', label: 'filtrar', icon: !showFilter.current ? <FaFilter/> : <FaTimes/>, onclick: filterToggle, active:false},
        radar: {id: 'radar', label: 'radar', icon: <GiRadarDish/>, onclick: radarToggle, active:false},
        lightning: {id: 'lightning', label: 'raios', icon: <BsFillLightningChargeFill/>, onclick: lightningToggle, active:false},
    })

    
    useEffect(_=>{
        showFilter.current = filterFormOptions.show
        setItems(state=>({
            ...state,
            filter: {...state.filter, icon: !showFilter.current ? <FaFilter/> : <FaTimes/>} 
        }))
    }, [filterFormOptions.show])
    

    function radarToggle(){
        
        let active = !radarShow.current

        dispatch(setShow(active))

        setItems(state=>({
            ...state,
            radar: {...state.radar, active}
        }))
        
        radarShow.current = active
    }

    function lightningToggle(){        
        // dispatch(setLightningShow(!lightningOptions.show))

        let active = !lightningShow.current

        dispatch(setLightningShow(active))

        setItems(state=>({
            ...state,
            lightning: {...state.lightning, active}
        }))
        
        lightningShow.current = active
    }


    function filterToggle(){
       dispatch(setFilterFormOption({field:'show', value:!showFilter.current}))       
    }

    function infoToggle(){
        
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <img src={spaguaslogocolored} width={'100%'}></img>
                <div className={styles.sibh_name}>SIBH</div>
            </div>
            <div className={styles.itemsWrapper}>
                {Object.values(items).map(item=> 
                    <div 
                        onClick={item.onclick} 
                        className={`${styles.item} ${item.active ? styles.active : ''}`}  
                        title={item.label}
                        key={item.id}>{item.icon}
                    </div> )}
            </div>
            
        </div>
    )
}

export default Topleft