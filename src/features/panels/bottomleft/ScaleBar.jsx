import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './ScaleBar.module.scss'

const MAX_WIDTH = 100 //orçamento máximo, em px, pro traço da escala

//mesmo algoritmo do L.Control.Scale do próprio Leaflet: arredonda a distância pra um número "redondo"
//(1,2,3,5,10,20,30,50,100...) ao invés de mostrar algo tipo "63 km"
const getRoundNum = num =>{
    const pow10 = Math.pow(10, (`${Math.floor(num)}`).length - 1)
    const d = num / pow10
    const mult = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1
    return pow10 * mult
}

const ScaleBar = () => {
    const map = useSelector(state => state.map.map)
    const [scale, setScale] = useState(null)

    useEffect(_=>{
        if(!map) return;

        const update = () =>{
            const y = map.getSize().y / 2

            //distância real (em metros) coberta por MAX_WIDTH pixels na altura central do mapa
            const maxMeters = map.distance(
                map.containerPointToLatLng([0, y]),
                map.containerPointToLatLng([MAX_WIDTH, y])
            )

            if(!maxMeters) return;

            const meters = getRoundNum(maxMeters)
            const label = meters < 1000 ? `${meters} m` : `${meters / 1000} km`
            const width = Math.round(MAX_WIDTH * (meters / maxMeters))

            setScale({width, label})
        }

        update()

        map.on('zoomend moveend', update)

        return _=> map.off('zoomend moveend', update)
    }, [map])

    if(!scale) return null

    return (
        <div className={styles.container}>
            <div className={styles.bar} style={{width: scale.width}}></div>
            <div className={styles.label}>{scale.label}</div>
        </div>
    )
}

export default ScaleBar
