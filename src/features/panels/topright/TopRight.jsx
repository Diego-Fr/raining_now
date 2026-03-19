import styles from "./TopRight.module.scss"
import { FaChartBar,FaLayerGroup } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'
import { setShow } from "@store/sideMenuSlice";
import {setShow as setShowLayersControl} from '@store/layersControlSlice'
import { useEffect, useRef, useState } from "react";


const TopRight = _ =>{
    const dispatch = useDispatch()
    const {show} = useSelector(state => state.layerscontrol)
    const showLayersControlRef = useRef(false)


    const [items, setItems] = useState({
        filter: {id: 'filter', label: 'Gráficos', icon: <FaChartBar />, onclick: sidemenuClick, active: false},
        layers: {id: 'layers', label: 'Camadas Auxiliares', icon: <FaLayerGroup />, onclick: layersClick, active:false},
    })

    function sidemenuClick(){
        dispatch(setShow(true))
    }
    

    function layersClick(){    
        // showLayersControlRef.current = !showLayersControlRef.current
        dispatch(setShowLayersControl(state=>!state))
    }

    useEffect(_=>{
        setItems(state =>({
            ...state, layers: {...state.layers, active: show}
        }))
    },[show])

    return (
        <div className={styles.container}>
            <div className={styles.itemsWrapper}>
                {Object.values(items).map(item=> 
                    <div 
                        onClick={item.onclick} 
                        className={`${styles.item} ${item.active ? styles.active : ''}`}  
                        key={item.id}
                        title={item.label}
                        >
                            {item.icon}
                    </div> )}
            </div>
            
        </div>
    )
}

export default TopRight