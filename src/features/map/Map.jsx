import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setMap } from "../../store/mapSlice";
import Markers from "../markers/Markers";
import { updateStations } from "../../store/stationSlice";

import 'leaflet-markers-canvas'

const Map = () =>{
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null)
    const markers = useSelector(state => state.map.markers)
    const context = useSelector(state => state.context)
    const hours = useSelector(state=>context.hours)

    const dispatch = useDispatch()


    useEffect(_=>{
        dispatch(
            updateStations()
        )
        if (mapRef.current && !mapInstanceRef.current) {
            const map = L.map(mapRef.current).setView([-23.55, -46.63], 8)
      
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map)

            let svg = L.svg().addTo(map)
      
            // Guarda instância no ref
            mapInstanceRef.current = map

            var markersCanvas = new L.MarkersCanvas();

            dispatch(setMap(map))
            
            
            
          }
    },[])

    useEffect(_=>{        
        dispatch(
            updateStations()
        )
    },[context, hours])


    return (
        <div ref={mapRef} style={{height: '800px', width:'100%', position:'relative'}}>
            <Markers />
        </div>
    )
}

export default Map