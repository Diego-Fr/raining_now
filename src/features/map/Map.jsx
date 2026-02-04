import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setMap } from "../../store/mapSlice";
import Markers from "../markers/Markers";
import { updateStations } from "../../store/stationSlice";

// import 'leaflet-markers-canvas'
import { getGeoCities } from "../../utils/geoLayers";
import { featurePPDCStyle, geoLayersToFeatureGroupPPDC } from "./MapUtils";
import { feachCityLimiares } from "../../services/api";
import { ToastContainer, toast } from 'react-toastify'
import { setHours } from "../../store/contextSlice";
import Lightning from "../lightning/Lightning";
import { CanvasMarkerProvider, useCanvasMarkerReady } from "../../context/CanvasMarkerContext";

const Map = () =>{
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null)
    const [mapHeight, setMapHeight] = useState()
    const markers = useSelector(state => state.map.markers)
    const context = useSelector(state => state.context)
    const hours = useSelector(state=>context.hours)
    const stations = useSelector(state=>state.station.stations)
    const [blocked, setBlocked] = useState(true)

    const dispatch = useDispatch()

    const [cityGeoJSONs, setCityGeoJSONs] = useState()
    const [cityFeatureGroup, setCityFeatureGroup] = useState()
    const [cityLimiares, setCityLimiares] = useState()

    const stationContext = useSelector(state=>state.station)

    const {canvasMarkersReady} = useCanvasMarkerReady()

    
    const removeCityFeatureFromMap = () =>{
        if(mapInstanceRef.current && cityFeatureGroup && mapInstanceRef.current.hasLayer(cityFeatureGroup)){           
            mapInstanceRef.current.removeLayer(cityFeatureGroup)
        }
    }

    useEffect(_=>{
        dispatch(
            updateStations()
        )
        if (mapRef.current && !mapInstanceRef.current) {
            const map = L.map(mapRef.current, 
                {zoomControl: false, minZoom: 7, zoomDelta: 0.1, wheelPxPerZoomLevel: 3100})
      
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map)
            

            let svg = L.svg().addTo(map)
      
            // Guarda instância no ref
            mapInstanceRef.current = map

            dispatch(setMap(map))
            
            setBlocked(false)
            
            map.fitBounds([
                [-25.3, -53.1],
                [-19.7, -44.2]
            ]) //bbox estado de SP

            window.addEventListener('resize', () => {
                if(!map) return;
                setMapHeight(window.innerHeight)
                map.invalidateSize()
                
            });
            
        }
    },[])

    useEffect(_=>{        
        if(!blocked){            
            //alterar as horas pra 72
            if(context.context === 'ppdc' && hours != 72){
                dispatch(setHours(72))
                return;
            } 
            
            dispatch(
                updateStations()
            )
        }     
        
    },[context, hours])

    useEffect(_=>{
        if(stationContext.loadingError){
            toast.error('Erro ao buscar medições ')
        }
    }, [stationContext.loadingError])

    useEffect(_=>{
        const run = async () =>{
            if(!blocked){
                
                if(context.context === 'ppdc' && stations.length > 0 && cityLimiares != undefined){
                    
                    if(!cityGeoJSONs){
                        let res = await getGeoCities()
                        
                        setCityGeoJSONs(res.features)
                    } else {
                        if(cityFeatureGroup){
                            cityFeatureGroup.remove()
                            setCityFeatureGroup(null)
                        }
                        
                        let featureGroup = geoLayersToFeatureGroupPPDC(cityGeoJSONs, stations,cityLimiares)

                        featureGroup.addTo(mapInstanceRef.current)

                        setCityFeatureGroup(featureGroup)
                    }

                    
                }
                 else if(context.context != 'ppdc' && cityFeatureGroup){

                    removeCityFeatureFromMap()

                }
            }
        }

        run()
    }, [stations,cityLimiares, cityGeoJSONs])

    useEffect(_=>{

        const run = async _ =>{
            if(!cityLimiares){
                let res = await feachCityLimiares()
                setCityLimiares(res)                
            } 
        }

        if(!blocked){
            run()
        }    
        
    },[context])

    useEffect(_=>{
        setMapHeight(window.innerHeight)
        mapInstanceRef.current.invalidateSize()
    })

    useEffect(_=>{
        if(canvasMarkersReady){            
            mapInstanceRef.current.invalidateSize()
        }
    }, [canvasMarkersReady])



    return (
        <div ref={mapRef} style={{height: `${mapHeight}px`, width:'100%', position:'relative'}}>
            
            {canvasMarkersReady && <><Markers /><Lightning/></>}
            
        </div>
    )
}

export default Map