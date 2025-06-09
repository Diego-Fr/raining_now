import { useState } from 'react'
import styles from './Topleft.module.scss'
import { FaFilter } from "react-icons/fa6";
import { FaInfo, FaTimes } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'
import { setFilterFormOption } from '../../store/filterSlice';
import spaguaslogocolored from '@assets/SP-Águas---Branco.png'
import { setShow } from '../../store/radarSlice';
import { setShow as setShowSidemenu } from '../../store/sideMenuSlice'
import { GiRadarDish } from "react-icons/gi";




const Topleft = () =>{
    const dispatch = useDispatch()
    const filterFormOptions = useSelector(state=>state.filter.filterFormOptions)
    const radarOptions = useSelector(state=>state.radar)
    
    const items = [
        {id: 'filter', label: 'filtrar', icon: !filterFormOptions.show ? <FaFilter/> : <FaTimes/>, onclick: filterToggle},
        {id: 'radar', label: 'radar', icon: <GiRadarDish/>, onclick: radarToggle},
        {id: 'info', label: 'filtrar', icon: <FaInfo/>, onclick: infoToggle},
    ]

    function radarToggle(){
        console.log(radarOptions.show);
        
        dispatch(setShow(!radarOptions.show))
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
                {items.map(item=> 
                    <div 
                        onClick={item.onclick} 
                        className={`${styles.item} ${radarOptions.show && item.id === 'radar' ? styles.active : ''}`}  
                        key={item.id}>{item.icon}
                    </div> )}
            </div>
            
        </div>
    )
}

export default Topleft