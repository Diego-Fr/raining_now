import { use, useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { fetchLightnings } from '../../services/api'
import { generateMarkerSVG } from './LightningUtil'
import moment from 'moment'

const Lightning = () =>{

    if(!L.MarkersCanvas){return;}
    
    const map = useSelector(state=>state.map.map)
    const markersFeatureGroup = useRef(new L.MarkersCanvas())
    const lightningOptions = useSelector(state => state.lightning)
    const INTERVAL = useRef()

    const UPDATE_TIMER_SECONDS = 300

    const [lightnings, setLightnings] = useState([])

    useEffect(_=>{
        
        if(map){
            
            
            if(lightningOptions.show){
                showLightnings()
                if(!INTERVAL.current){
                    INTERVAL.current = setInterval(_=>{
                        showLightnings()
                    }, UPDATE_TIMER_SECONDS * 1000)
                }
            } else {
                if(INTERVAL.current) {
                    
                    clearInterval(INTERVAL.current)
                    INTERVAL.current = undefined
                }                
                removeLightnings()
            }
            
        }
    }, [lightningOptions])

    useEffect(_=>{
       
        if(!map) return;
        if(!map.hasLayer(markersFeatureGroup.current)){           
            map.addLayer(markersFeatureGroup.current)
            markersFeatureGroup.current._reset();
        }
    },[map])

    useEffect(_=>{
        if(!map) return;
        
        markersFeatureGroup.current.clear()

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

            var marker = L.marker([lightning.latitude, lightning.longitude], {icon: icon, interactive:false})
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
        
        
        // markersFeatureGroup.current._redraw();

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
        setLightnings([])
    }

    return (
        <></>
    )
}   

export default Lightning