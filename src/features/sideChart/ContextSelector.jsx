import { useEffect, useState } from 'react'
import styles from './ContextSelector.module.scss'
import {useSelector} from 'react-redux'

const ContextSelector = ({setExibitionType,menuContext}) =>{
    
    const [active, setActive] = useState('chart')
    const context = useSelector(state=>state.context.context)

    const clickHandler = context => {
        setActive(context)
        setExibitionType(context)
    }

    useEffect(_=>{
        if(context === 'rain'){
            setActive('chart')
        } else if(context === 'level'){
            setActive('table')
        }
    },[context])

    return <div className={styles.container}>
        { context === 'rain'  && <div onClick={_=>clickHandler('chart')} className={`${styles.button} ${active === 'chart' ? styles.active : ''}`}>Gráfico</div> }
        <div onClick={_=>clickHandler('table')} className={`${styles.button} ${active === 'table' ? styles.active : ''}`}>Tabela</div>
    </div>
}

export default ContextSelector