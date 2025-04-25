import { useEffect, useRef } from "react";
import {useSelector} from 'react-redux'
import statesFlu from '../../data/statesFlu'
import statesPlu from "../../data/statesPlu";
import {getCurrentFluState, getCurrentPluState} from './MarkersUtil'

const Markers = options =>{
    const stations = useSelector((state) => state.station.stations)
    const map = useSelector((state) => state.map.map)
    const markersFeatureGroup = useRef(new L.MarkersCanvas())
    const filter = useSelector(state=> state.filter)
    const context = useSelector(state=> state.context)

    let markers_list = []

    const createMarkers = () =>{
        markersFeatureGroup.current.clear()
        
        markers_list = []

        stations.forEach(station=>{
            if(station.show){
                const svgCode = generateMarkerSVG(station);
                const encodedSvg = btoa(svgCode);
                const dataURI = `data:image/svg+xml;base64,${encodedSvg}`;

                var icon = L.icon({
                    iconUrl: dataURI,
                    iconSize: [18, 18],
                    iconAnchor: [9, 9]
                });

                var marker = L.marker([station.latitude, station.longitude], {icon: icon, id:station.station_prefix_id, show: station.show}).bindPopup(`<b>${station.station_prefix_id}</b><br>ID: ${station.value}`)
                markers_list.push(marker)
            }
            
            
        })

        markersFeatureGroup.current.addMarkers(markers_list);

    }


    function generateMarkerSVG(station){   
        
        let html = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
        let style = buildMarkerStyle(station)

        if(context.context === 'rain'){
            html += `<circle cx="50" cy="50" r="40" style="${style}"/>`
            html += `<text font-family="Arial, Helvetica, sans-serif" x="50%" y="55%" font-size="${70}" text-anchor="middle" dominant-baseline="middle" fill="white">${station.value.toFixed(0)}</text>`
        } else if(context.context === 'level'){
            html += `<circle cx="50" cy="50" r="30" style="${style}"/>`
        }        
        
        return html + '</svg>'
    }

    const buildMarkerStyle = station =>{
        
        if(context.context === 'level'){
            let state = getCurrentFluState(station)
            
            return `fill:${statesFlu[state].color};stroke:black;stroke-width:3`
        } else if(context.context === 'rain'){
            let state = getCurrentPluState(station)

            return `fill:${statesPlu[state].color};stroke:black;stroke-width:3`
        }
    } 

    useEffect(_=>{
        
        if(map && !map.hasLayer(markersFeatureGroup.current)){
            map.addLayer(markersFeatureGroup.current)
        }

        if(map && stations?.length > 0){
            createMarkers()
            // dispatch(updateMarkers(markers))
            
        }
    }, [map, stations])

    return (
        <></>
    )
}

export default Markers