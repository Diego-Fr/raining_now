import styles from './LayerControl.module.scss'
import layerControlList from '../../data/layerControlList'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import { getBoundingBox, addLayer } from './utils'
import { feachCitiesBbox, feachSubugrhisBbox } from '../../services/api'
import { setFilterOption } from '../../store/filterSlice'

const LayerControl = _ =>{

    const map = useSelector(state=> state.map.map)
    const filterOptions = useSelector(state=>state.filter.filterOptions)
    const stations = useSelector(state=> state.station.stations)
    const [layersShowing, setLayersShowing] = useState({
        'city_id': {show: false, layer:undefined},
        'state': {show:true, layer:undefined}
    })
    const context = useSelector(state=>state.context.context)

    const searchOptions = useSelector(state=>state.search)

    const dispatch = useDispatch()

    const clickHandler = layer =>{
        let copy = Object.assign(layersShowing[layer.id])
        
        setLayersShowing({...layersShowing, copy})

    }

    const resetBounds = () =>[
        map.fitBounds([
            [-25.3, -53.1],
            [-19.7, -44.2]
        ]) //bbox estado de SP
    ]

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
            
            if(namesByKey[key]){
                if(context != 'ppdc'){
                    let l = addLayer(map, `geonode:${namesByKey[key].layer}`, `${namesByKey[key].field} in (${Object.keys(items).map(x=> x )})`)
                    // l.addTo(map)
                    setLayersShowing(prev => ({
                        ...prev,
                        [key]: {...prev[key], layer: l}
                    }))
                }                 

                // namesByKey[key].feachFunc(Object.keys(items)).then(resp=>{
                //     map.fitBounds(getBoundingBox(resp.map(x=>x.bbox_json)))
                // })
            }
            

            
        } else if(counter.length === 0 && map){
            
            Object.keys(layersShowing).filter(x=>['city_id', 'subugrhi_id'].includes(x)).map(x=> layersShowing[x].layer?.remove())
            
        }
        
        
    }, [filterOptions])

    useEffect(_=>{
        if(!map) return;
        layersShowing['municipios_sp']?.layer?.remove()
        layersShowing['subugrhis_sp']?.layer?.remove()


        const namesByKey = {
            'município': {layer:'municipios_sp', field: 'cd_mun', station_field: 'cod_ibge'},
            'subugrhi': {layer:'subugrhis_sp', field: 'n_subugrhi', station_field: 'subugrhi_cod'}
        }
        
        if(searchOptions.cod === null || searchOptions.cod === undefined || searchOptions.cod === '') {
            resetBounds()
            dispatch(setFilterOption({field: 'cod_ibge', value: []}))
            dispatch(setFilterOption({field: 'subugrhi_cod', value: []}))            
            return;
        }
        
        dispatch(setFilterOption({field: namesByKey[searchOptions.type].station_field, value: [searchOptions.cod]}))
        
        let l = addLayer(map, namesByKey[searchOptions.type].layer, `${namesByKey[searchOptions.type].field} in (${searchOptions.type != 'subugrhi' ? searchOptions.cod : prepareCod(searchOptions.cod)})`, {style: 'municipios_sp_raining_now'})
        
        setLayersShowing(prev => ({
            ...prev,
            [namesByKey[searchOptions.type].layer]: {...prev[namesByKey[searchOptions.type].layer], layer: l}
        }))
        
        if(searchOptions.bbox){
            map.fitBounds(searchOptions.bbox)
        } else {
            resetBounds()
        }
        
    },[searchOptions])

    const prepareCod = (cod) =>{
        let c = parseInt(cod)
        c = c < 1000 ? (c / 10).toFixed(1) : (c / 100).toFixed(2)
        return c
    }
    

    return (
        <div className={styles.container}>
            {layerControlList.list.map((item, index) => <div key={index}><input type='checkbox' onClick={_=>clickHandler(item)}></input>{item.title}</div> )}
        </div>
    )
}

export default LayerControl