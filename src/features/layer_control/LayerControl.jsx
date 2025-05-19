import styles from './LayerControl.module.scss'
import layerControlList from '../../data/layerControlList'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import { getBoundingBox, addLayer } from './utils'
import { feachCitiesBbox, feachSubugrhisBbox } from '../../services/api'

const LayerControl = _ =>{

    const map = useSelector(state=> state.map.map)
    const filterOptions = useSelector(state=>state.filter.filterOptions)
    const stations = useSelector(state=> state.station.stations)
    const [layersShowing, setLayersShowing] = useState({
        'city_id': {show: false, layer:undefined},
        'state': {show:true, layer:undefined}
    })

    

    const clickHandler = layer =>{
        // console.log(id,map);
        // if(!layer.layer){
        //     let l = addLayer(map, layer.layer_name, "cd_mun='3550308'")
        //     layer.layer = l
        // } else {
        //     layer.layer.remove()
        //     layer.layer = undefined
        // }

        let copy = Object.assign(layersShowing[layer.id])

        
        setLayersShowing({...layersShowing, copy})

    }

    useEffect(_=>{
        if(map && !layersShowing.state.layer){
            
            let f = addLayer(map, `geonode:limiteestadualsp`, '', {style:'estadual_chuva_agora'})
            
            setLayersShowing(state=>({...layersShowing, 'state': {...state.state, layer: f} }))
        }
        
    }, [map])

    useEffect(_=>{
        let {city_id, subugrhi_id, ugrhi_id } = filterOptions
        
        let a = {city_id, ugrhi_id, subugrhi_id} //transformando em obj com keys        
        
        let counter = Object.entries(a).filter(([id, array])=>array?.length > 0)
        
        const namesByKey = {
            city_id: {layer:'municipios_sp', field: 'cd_mun', feachFunc:feachCitiesBbox},
            subugrhi_id: {layer:'subugrhis_sp', field: 'n_subugrhi', feachFunc:feachSubugrhisBbox}
        }

        if(counter.length > 0){
            let item = counter[0][1]
            let key = counter[0][0]
            let items = {}
            
            stations.forEach(station=>{
                if(item.includes(station[key]?.toString())){
                    if(key === 'city_id'){
                        items[station.cod_ibge] = undefined
                    } else if(key === 'subugrhi_id'){                        
                        let cod = parseInt(station.subugrhi_cod)
                        cod = cod < 1000 ? (cod / 10).toFixed(1) : (cod / 100).toFixed(2)
                        items[cod] = undefined
                    }
                    
                }
                
            })
                
            layersShowing[key]?.layer?.remove()
            
            let l = addLayer(map, `geonode:${namesByKey[key].layer}`, `${namesByKey[key].field} in (${Object.keys(items).map(x=> x )})`)
            // l.addTo(map)
            setLayersShowing(prev => ({
                ...prev,
                [key]: {...prev[key], layer: l}
            }))

            namesByKey[key].feachFunc(Object.keys(items)).then(resp=>{
                map.fitBounds(getBoundingBox(resp.map(x=>x.bbox_json)))
            })

            
        } else if(counter.length === 0 && map){
            
            Object.keys(layersShowing).filter(x=>['city_id', 'subugrhi_id'].includes(x)).map(x=> layersShowing[x].layer?.remove())
            map.fitBounds([
                [-25.3, -53.1],
                [-19.7, -44.2]
            ]) //bbox estado de SP
        }
        
        
    }, [filterOptions])

    return (
        <div className={styles.container}>
            {layerControlList.list.map((item, index) => <div key={index}><input type='checkbox' onClick={_=>clickHandler(item)}></input>{item.title}</div> )}
        </div>
    )
}

export default LayerControl