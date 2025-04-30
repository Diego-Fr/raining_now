import {useSelector} from 'react-redux'

import styles from './Item.module.scss'


const Item = options =>{
    const {id, title, onclick, customClass, icon} = options
    const context = useSelector(state => state.context.context)

    const clickHandler = () =>{
        onclick(id)
    }

    return (
        <div className={`${styles.icon} ${id===context ? styles.active : null} ${styles[customClass]}`} onClick={clickHandler}>
            <div className={`${styles.iconWrapper}`}><div className={styles.icon}>{icon}</div> <div className={styles.title}>{title}</div></div>
        </div>
    )
}

export default Item