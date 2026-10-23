import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

//clique com o botão direito no mapa mostra um tooltip com lat/lng do ponto clicado.
//fecha ao clicar em qualquer lugar do mapa, ou move pro novo ponto se clicar com o botão direito de novo.
const CoordinatesTooltip = () =>{

    const map = useSelector(state=> state.map.map)
    const tooltipRef = useRef(null)

    useEffect(_=>{
        if(!map) return;

        const removeTooltip = () =>{
            if(tooltipRef.current){
                map.removeLayer(tooltipRef.current)
                tooltipRef.current = null
            }
        }

        const onContextMenu = e =>{
            removeTooltip()

            const {lat, lng} = e.latlng

            tooltipRef.current = L.tooltip({
                permanent: true,
                direction: 'top',
                offset: [0, -10],
                className: 'coords-tooltip'
            })
                .setLatLng(e.latlng)
                .setContent(`Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
                .addTo(map)
        }

        map.on('contextmenu', onContextMenu)
        map.on('click', removeTooltip)

        return _=>{
            map.off('contextmenu', onContextMenu)
            map.off('click', removeTooltip)
            removeTooltip()
        }
    }, [map])

    return null
}

export default CoordinatesTooltip
