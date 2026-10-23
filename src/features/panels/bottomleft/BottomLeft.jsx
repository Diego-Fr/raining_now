import { useIsMobile } from '../../../hooks/isMobile'
import styles from './BottomLeft.module.scss'
import GlobalLegend from './GlobalLegend'
import ScaleBar from './ScaleBar'

const BottomLeft = _ =>{
    const isMobile = useIsMobile()
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                {!isMobile && <GlobalLegend/>}
                <ScaleBar/>
            </div>
        </div>
    )
}

export default BottomLeft