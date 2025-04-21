import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setMap } from "../../store/mapSlice";
import Markers from "../markers/Markers";
import { updateStations } from "../../store/stationSlice";

const Map = () =>{
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null)
    const markers = useSelector(state => state.map.markers)
    
    const markersFeatureGroup = useRef(L.featureGroup())
    
    const dispatch = useDispatch()


    useEffect(_=>{
        dispatch(
            updateStations()
        )
        if (mapRef.current && !mapInstanceRef.current) {
            const map = L.map(mapRef.current).setView([-23.55, -46.63], 13)
      
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map)
      
            markersFeatureGroup.current.addTo(map)
      
            // Guarda instância no ref
            mapInstanceRef.current = map

            dispatch(setMap(map))
            
            
          }
    },[])


    return (
        <div ref={mapRef} style={{height: '800px', width:'100%'}}>
            <Markers />
        </div>
    )
}

export default Map