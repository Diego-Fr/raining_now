import { useEffect, useRef, useState } from 'react'
import styles from './Topleft.module.scss'
import { FaFilter } from "react-icons/fa6";
import { FaInfo, FaTimes } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'
import { setFilterFormOption } from '../../store/filterSlice';
import spaguaslogocolored from '@assets/SP-Águas---Branco.png'
import { setShow } from '../../store/radarSlice';
import { setShow as setShowSidemenu } from '../../store/sideMenuSlice'
import { GiRadarDish } from "react-icons/gi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { setShow as setLightningShow } from '../../store/lightningSlice';





const Topleft = () =>{
    const dispatch = useDispatch()
    const filterFormOptions = useSelector(state=>state.filter.filterFormOptions)
    const radarOptions = useSelector(state=>state.radar)
    const lightningOptions = useSelector(state=>state.lightning)
    
    const radarShow = useRef(false)
    const lightningShow = useRef(false)
    
    const [items, setItems] = useState({
        filter: {id: 'filter', label: 'filtrar', icon: !filterFormOptions.show ? <FaFilter/> : <FaTimes/>, onclick: filterToggle, active:false},
        radar: {id: 'radar', label: 'radar', icon: <GiRadarDish/>, onclick: radarToggle, active:false},
        lightning: {id: 'lightning', label: 'raios', icon: <BsFillLightningChargeFill/>, onclick: lightningToggle, active:false},
    })

    

    

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
       dispatch(setFilterFormOption({field:'show', value:!filterFormOptions.show}))
    }

    function infoToggle(){
        
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={spaguaslogocolored} width={'100%'}></img>
            </div>
            <div className={styles.itemsWrapper}>
                {Object.values(items).map(item=> 
                    <div 
                        onClick={item.onclick} 
                        className={`${styles.item} ${item.active ? styles.active : ''}`}  
                        key={item.id}>{item.icon}
                    </div> )}
            </div>
            
        </div>
    )
}

export default Topleft