import { useEffect, useRef } from "react";
import {useSelector} from 'react-redux'

const Markers = options =>{
    const stations = useSelector((state) => state.station.stations)
    const map = useSelector((state) => state.map.map)
    const markersFeatureGroup = useRef(L.featureGroup())
    const filter = useSelector(state=> state.filter)

    let markers_list = []


    const showMarkers = () =>{
        markersFeatureGroup.current.clearLayers()
        
        markers_list.map(x=> x.options.show ? markersFeatureGroup.current.addLayer(x) : null )
    }

    const createMarkers = () =>{
        // console.log('asdij');
        
        // let markers = []
        stations.forEach(station=>{
            // console.log(station);
            
            var marker = L.marker([station.latitude, station.longitude], {id:station.station_prefix_id, show: station.show}).bindPopup(`<b>${station.station_prefix_id}</b><br>ID: ${station.value}`)
            markers_list.push(marker)
        })

        // filterMarkers()

        showMarkers()

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