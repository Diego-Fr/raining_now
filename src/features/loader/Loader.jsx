import styles from './Loader.module.scss'

import { Oval } from 'react-loader-spinner'
import {useSelector} from 'react-redux'

const Loader = () =>{

    const stationsLoading = useSelector(state=>state.station.stationsLoading)

    return (
        <div className={`${styles.container} ${stationsLoading && styles.show}`}>
            
            <Oval
                visible={true}
                height="50"
                width="50"
                color="#0077b6"
                secondaryColor="#0077b6"
                ariaLabel="oval-loading"
                strokeWidth={5}
                wrapperStyle={{}}
                wrapperClass=""
                />
        </div>

        
    )

}

export default Loader