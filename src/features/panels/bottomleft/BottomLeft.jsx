import { useIsMobile } from '../../../hooks/isMobile'
import styles from './BottomLeft.module.scss'
import GlobalLegend from './GlobalLegend'

const BottomLeft = _ =>{ 
    const isMobile = useIsMobile()  
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                {!isMobile && <GlobalLegend/>}
                
            </div>
        </div>
    )
}

export default BottomLeft