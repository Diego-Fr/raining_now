import { useState } from 'react'
import styles from './ContextSelector.module.scss'

const ContextSelector = ({setExibitionType}) =>{

    const [active, setActive] = useState('chart')

    const clickHandler = context => {
        setActive(context)
        setExibitionType(context)
    }

    return <div className={styles.container}>
        <div onClick={_=>clickHandler('chart')} className={`${styles.button} ${active === 'chart' ? styles.active : ''}`}>Gráfico</div>
        <div onClick={_=>clickHandler('table')} className={`${styles.button} ${active === 'table' ? styles.active : ''}`}>Tabela</div>
    </div>
}

export default ContextSelector