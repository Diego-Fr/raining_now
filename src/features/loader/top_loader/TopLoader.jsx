import { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import styles from './TopLoader.module.scss'

const TopLoader = () =>{
    const progressContainerRef = useRef()
    const stationConfig = useSelector(state=>state.station)
    const [progressSize, setProgressSize] = useState(100)

    useEffect(_=>{
        let interval
        if(stationConfig.stationsLoading && progressContainerRef.current){
            setProgressSize(100)
        } else {
            const updatesPerSecond = 4;
            const durationInSeconds = 60;
            const totalSteps = durationInSeconds * updatesPerSecond;
            const decrementPerStep = 100 / totalSteps;
            interval = setInterval(_=>{
                setProgressSize(prev => {
                    const next = prev - decrementPerStep;
                    if (next <= 0) {
                      clearInterval(interval);
                      return 0;
                    }
                    return next;
                });
            }, 1000 / updatesPerSecond)
        }

        return () => clearInterval(interval);
    }, [stationConfig.stationsLoading])

    useEffect(_=>{
        if(stationConfig.loadingError){
            setProgressSize(100)
        }
    }, [stationConfig.loadingError])

    return (
        <div className={styles.container}>
            <div ref={progressContainerRef} style={{width: `${progressSize}%`}} className={styles.progressContainer}></div>
        </div>
    )
}

export default TopLoader