import styles from './BottomLeft.module.scss'
import GlobalLegend from './GlobalLegend'

const BottomLeft = _ =>{   
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <GlobalLegend/>
            </div>
        </div>
    )
}

export default BottomLeft