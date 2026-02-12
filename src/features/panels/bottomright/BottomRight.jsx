import { useIsMobile } from '../../../hooks/isMobile'
import styles from './BottomRight.module.scss'
import spaguaslogocolored from '@assets/SP-Águas - -Colorido.png'
// import GlobalLegend from '../bottomleft/GlobalLegend'

const BottomRight = _ =>{   

    const isMobile = useIsMobile()

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                {/* <GlobalLegend/> */}
                {!isMobile && <img src={spaguaslogocolored} width={'100%'}></img>}
            </div>
        </div>
    )
}

export default BottomRight