import styles from "./TopRight.module.scss"
import { FaChartBar } from "react-icons/fa";
import {useDispatch} from 'react-redux'
import { setShow } from "../../../store/sideMenuSlice";


const TopRight = _ =>{
    const dispatch = useDispatch()
    const items = [
        {id: 'filter', label: 'SideMenu', icon: <FaChartBar />, onclick: sidemenuClick},
    ]

    function sidemenuClick(){
        dispatch(setShow(true))
    }
    

    return (
        <div className={styles.container}>
            <div className={styles.itemsWrapper}>
                {items.map(item=> 
                    <div 
                        onClick={item.onclick} 
                        className={`${styles.item}`}  
                        key={item.id}>{item.icon}
                    </div> )}
            </div>
            
        </div>
    )
}

export default TopRight