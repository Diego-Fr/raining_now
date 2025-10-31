import styles from './BottomRIght.module.scss'
import spaguaslogocolored from '@assets/SP-Águas - -Colorido.png'

const BottomRight = _ =>{   
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={spaguaslogocolored} width={'100%'}></img>
            </div>
        </div>
    )
}

export default BottomRight