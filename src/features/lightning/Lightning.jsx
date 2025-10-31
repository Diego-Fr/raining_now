import { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { fetchLightnings } from '../../services/api'
import { generateMarkerSVG } from './LightningUtil'
import moment from 'moment'

const Lightning = () =>{
    const map = useSelector(state=>state.map.map)
    const markersFeatureGroup = useRef(new L.MarkersCanvas())
    const lightningOptions = useSelector(state => state.lightning)
    const stations = useSelector((state) => state.station.stations)

    const [lightnings, setLightnings] = useState([])

    useEffect(_=>{
        
        if(map){
            if(!map.hasLayer(markersFeatureGroup.current)){                
                map.addLayer(markersFeatureGroup.current)
            }
            if(lightningOptions.show && stations.length > 0){
                showLightnings()
            } else {
                removeLightnings()
            }
            
        }
    }, [lightningOptions, stations])

    useEffect(_=>{
        if(!map) return;
        let markers_list = []
        lightnings.forEach(lightning=>{
                
            const svgCode = generateMarkerSVG(lightning);
            const encodedSvg = btoa(svgCode);
            const dataURI = `data:image/svg+xml;base64,${encodedSvg}`;

            var icon = L.icon({
                iconUrl: dataURI,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            var marker = L.marker([lightning.latitude, lightning.longitude], {icon: icon})
            marker.bindPopup(`${diffHandler(lightning)}`).on({
            mouseover(e) {                
                this.openPopup();
            },
            mouseout(e) {
                this.closePopup();
            },
            });

            markers_list.push(marker)
            
            
        })
        
        markersFeatureGroup.current.addMarkers(markers_list);

    }, [lightnings])

    const diffHandler = lightning =>{
        let diff = moment().diff(moment(lightning.datetime), 'minutes')
        return diff >= 60 ? `${Math.round(diff / 60 )} hora${Math.round(diff / 60 ) > 1 ? 's' : ''} atrás` : `${diff} minutos atrás`
    }

    const showLightnings = async () =>{
        let data = await fetchLightnings()
        // console.log(data)

        setLightnings(data)

        
    }

    const removeLightnings = () =>{
        if(!markersFeatureGroup.current) return;

        markersFeatureGroup.current.clear()
    }

    return (
        <></>
    )
}   

export default Lightning