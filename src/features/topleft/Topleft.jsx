import { useState } from 'react'
import styles from './Topleft.module.scss'
import { FaFilter } from "react-icons/fa6";
import { FaInfo, FaTimes } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'
import { setFilterFormOption } from '../../store/filterSlice';



const Topleft = () =>{
    const dispatch = useDispatch()
    const filterFormOptions = useSelector(state=>state.filter.filterFormOptions)
    const items = [
        {id: 'filter', label: 'filtrar', icon: !filterFormOptions.show ? <FaFilter/> : <FaTimes/>, onclick: filterToggle},
        {id: 'info', label: 'filtrar', icon: <FaInfo/>},
    ]


    function filterToggle(){
       dispatch(setFilterFormOption({field:'show', value:!filterFormOptions.show}))
    }

    return (
        <div className={styles.container}>
            <div className={styles.itemsWrapper}>
                {items.map(item=> <div  onClick={item.onclick} className={styles.item} key={item.id}>{item.icon}</div> )}
            </div>
            
        </div>
    )
}

export default Topleft