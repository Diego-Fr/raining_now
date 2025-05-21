import statesPlu from "../../data/statesPlu";
import { statsByCity, classifyStation } from "../../utils/stationUtils";
import statesPPDC from '@/data/statesPPDC'

const geoLayersToFeatureGroupPPDC = (layers=[], stations, citiesLimiares) =>{
    let featureGroup = L.featureGroup()
    let stats = statsByCity(stations)

    layers.forEach(layer=>{
        L.geoJSON(layer, {
            onEachFeature: (feature, l) =>{
                
                const {cd_mun,nm_mun} = l.feature.properties
                let stat = stats[cd_mun]
                
                let limiar = citiesLimiares.find(x=>x.cod_ibge.toString() === cd_mun.toString())
                if(stat && limiar){
                    
                    l.setStyle({
                        fillColor: stat.max > (limiar.limiares['ppdc'] || limiar.limiares['ipt']) ? statesPPDC['attention'].color : statesPPDC['normal'].color ,
                        color: 'black',
                        opacity: 0.8,
                        fillOpacity: 0.5,
                        weight: 1
                    })
                } else {
                    l.setStyle({
                        color:'black',
                        weight: 1,
                        opacity: 0.8
                    })
                }

                l.bindTooltip(`${nm_mun}<br>
                            ${stat?.max >= 0 ? `<span style='color:var(--toastify-color-info);font-weight:600;font-size:larger'>Acc: ${stat.max.toFixed(2)} mm</span> <br>` : ''}
                            ${limiar?.limiares['ppdc'] ? `PPDC ${limiar?.limiares['ppdc']}` : limiar?.limiares['ipt'] ? `IPT ${limiar?.limiares['ipt']}` : ''}
                            `, {
                    sticky: true, 
                    // permanent: false,
                    direction: 'top',
                    interactive: false
                });

                l.on('mouseout', function () {
                    l.closeTooltip();
                });                
                
            }
        }).addTo(featureGroup)
    })

    // featureGroup.id = featureName

    return featureGroup

    // featureGroup.addTo(map)
}

const featurePPDCStyle = (featureGroup, stations) =>{

    let layers = Object.values(featureGroup._layers).map(x=>Object.values(x._layers)[0])
    // console.log(layers);
    
    let stats = statsByCity(stations)
    // console.log(statsByCity(stations))
    

    return featureGroup
}


export {
    geoLayersToFeatureGroupPPDC,
    featurePPDCStyle
}