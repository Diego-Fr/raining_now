import styles from './LayerControl.module.scss'
import layerControlList from '../../data/layerControlList'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import { getBoundingBox, addLayer, iconByLayer } from './utils'
import { feachCitiesBbox, feachSubugrhisBbox } from '../../services/api'
import { setFilterOption } from '../../store/filterSlice'

import hidro_icon from '@assets/hidrografia.png'
import LayerItem from './LayerItem'

const LayerControl = _ =>{

    const map = useSelector(state=> state.map.map)
    
    const [layersShowing, setLayersShowing] = useState({
        'city_id': {show: false, layer:undefined},
        'state': {show:true, layer:undefined},
        'hidro': {show: false, layer: undefined}
    })

    const [layersList, setLayersList] = useState({
        city_id: {id: 'city_id', layer:'municipios_sp', type:'município', field: 'cd_mun', station_field: 'cod_ibge', feachFunc:feachCitiesBbox, layer_instance: undefined},
        subugrhi_id: {id: 'subugrhi_id',layer:'subugrhis_sp', type: 'subugrhi', field: 'n_subugrhi', station_field: 'subugrhi_cod', feachFunc:feachSubugrhisBbox, layer_instance: undefined},
        ugrhi_id: {id: 'ugrhi_id',layer:'ugrhis_sp', type: 'ugrhi', field: 'ogc_fid', feachFunc:[], station_field: 'ugrhi_cod', layer_instance: undefined},
        hidro: {id: 'hidro',layer: 'hidrografia_completa', layer_instance: undefined}
    })

    const searchOptions = useSelector(state=>state.search)

    const dispatch = useDispatch()



    const clickHandler = item =>{

        let show = !item.show
        
        setLayersList(prev => ({...prev, [item.id]: {...prev[item.id], show}}))


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
            
            setLayersShowing(state=>({...state, 'state': {...state.state, layer: f} }))
        }
        
    }, [map])


    //analisa alteração no searchOptions e disparada eventos do filter
    useEffect(_=>{
        if(!map) return;
    
        const namesByKey = {
            'município': {layer:'municipios_sp', field: 'cd_mun', station_field: 'cod_ibge'},
            'subugrhi': {layer:'subugrhis_sp', field: 'n_subugrhi', station_field: 'subugrhi_cod'},
            'ugrhi': {layer:'ugrhis_sp', field: 'codigo', station_field: 'ugrhi_cod'}
        }
        
        if(searchOptions.cod === null || searchOptions.cod === undefined || searchOptions.cod === '') {
            resetBounds()
            dispatch(setFilterOption({field: 'cod_ibge', value: []}))
            dispatch(setFilterOption({field: 'subugrhi_cod', value: []}))        
            dispatch(setFilterOption({field: 'ugrhi_cod', value: []}))
            return;
        }
        
        
        dispatch(setFilterOption({field: namesByKey[searchOptions.type].station_field, value: [searchOptions.cod]}))
        
    },[searchOptions])


    return (
        <div className={styles.container}>
            {Object.values(layersList).map((item, index) => 
                <LayerItem key={index} options={item} onclick={clickHandler}/>
            )}
        </div>
    )
}

export default LayerControl