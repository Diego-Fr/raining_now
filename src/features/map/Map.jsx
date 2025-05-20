import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { setMap } from "../../store/mapSlice";
import Markers from "../markers/Markers";
import { updateStations } from "../../store/stationSlice";

import 'leaflet-markers-canvas'
import { getGeoCities } from "../../utils/geoLayers";
import { featurePPDCStyle, geoLayersToFeatureGroupPPDC } from "./MapUtils";
import { feachCityLimiares } from "../../services/api";
import { ToastContainer, toast } from 'react-toastify'

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
            const map = L.map(mapRef.current, {zoomControl: false}).setView([-23.55, -46.63], 8)
      
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map)

            let svg = L.svg().addTo(map)
      
            // Guarda instância no ref
            mapInstanceRef.current = map

            var markersCanvas = new L.MarkersCanvas();

            dispatch(setMap(map))
            
            setBlocked(false)   
            
        }
    },[])

    useEffect(_=>{        
        if(!blocked){
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


    return (
        <div ref={mapRef} style={{height: `${mapHeight}px`, width:'100%', position:'relative'}}>
            <Markers />
        </div>
    )
}

export default Map