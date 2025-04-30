import styles from './ContextMenu.module.scss'
import Item from './Item'
import {useDispatch} from 'react-redux'
import {setContext} from '../../store/contextSlice'

import { BsFillCloudRainFill } from "react-icons/bs";
import { FaWater } from "react-icons/fa";
import { MdLandslide } from "react-icons/md";




const ContextMenu = () =>{

    const dispatch = useDispatch()

    const items = [
        {id: 'rain', title: 'chuva', icon:<BsFillCloudRainFill />},
        {id: 'level', title: 'nível', icon:<FaWater/>},
        {id: 'ppdc', title: 'PPDC', icon:<MdLandslide/>}
    ]

    const itemClickHandler = id =>{        
        dispatch(setContext(id))
    }

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                {items.map((item, index)=>  
                    (<Item key={index} id={item.id} icon={item.icon} title={item.title} customClass={item.customClass} onclick={itemClickHandler} />)
                )}
                
            </div>
        </div>
    )
}

export default ContextMenu