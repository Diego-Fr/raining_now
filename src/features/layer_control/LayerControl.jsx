import styles from './LayerControl.module.scss'
import layerControlList from '../../data/layerControlList'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import { feachCitiesBbox, feachSubugrhisBbox } from '../../services/api'
import { setFilterOption } from '../../store/filterSlice'
import limitemunicipal from '@assets/municipios.png'
import limiteestadual from '@assets/limiteestadual.png'
import limitesubugrhi from '@assets/limitesubugrhi.png'
import limiteugrhi from '@assets/limiteugrhi.png'
import hidro_icon from '@assets/hidrografia.png'
import LayerItem from './LayerItem'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { FaLayerGroup } from "react-icons/fa";
import { setShow } from '../../store/layersControlSlice'



const LayerControl = _ =>{

    const map = useSelector(state=> state.map.map)

    const {show} = useSelector(state => state.layerscontrol)
    
    const [layersShowing, setLayersShowing] = useState({
        'city_id': {show: false, layer:undefined},
        'state': {show:true, layer:undefined},
        'hidro': {show: false, layer: undefined}
    })

    const [layersList, setLayersList] = useState({
        state: {id: 'state', style: {rangeValue: .05, strokeColor: '#212121', fillColor: '#62fff6', strokeWidth: 2}, show: true, icon: limiteestadual, layer: 'limiteestadualsp', strokeControl: {show: true}, fillControl: {show: true}, layer_instance: undefined},
        city_id: {id: 'city_id', icon:limitemunicipal,  strokeControl: {show: true}, fillControl: {show: true},  layer:'municipios_sp', type:'município', field: 'cd_mun', station_field: 'cod_ibge', feachFunc:feachCitiesBbox, layer_instance: undefined},
        subugrhi_id: {id: 'subugrhi_id', icon: limitesubugrhi, strokeControl: {show: true}, fillControl: {show: true},layer:'subugrhis_sp', type: 'subugrhi', field: 'n_subugrhi', station_field: 'subugrhi_cod', feachFunc:feachSubugrhisBbox, layer_instance: undefined},
        ugrhi_id: {id: 'ugrhi_id', icon: limiteugrhi, strokeControl: {show: true}, fillControl: {show: true}, layer:'ugrhis_sp', type: 'ugrhi', field: 'ogc_fid', feachFunc:[], station_field: 'ugrhi_cod', layer_instance: undefined},
        hidro: {id: 'hidro', icon: hidro_icon, layer: 'hidrografia_completa', strokeControl: {show:true}, layer_instance: undefined}
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

    const closeControl = () =>{
        dispatch(setShow(false))
    }

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
        <div className={`${styles.container} ${show ? styles.show : ''}`}>
            <div className={styles.title}><div className={styles.titleWrapper}><FaLayerGroup style={{marginRight: 5}}/><span>Camadas Auxiliares</span></div><div style={{float: 'right', cursor: 'pointer'}} onClick={closeControl}><IoCloseOutline/></div></div>
            <div className={styles.itemsWrapper}>
            {Object.values(layersList).map((item, index) => 
                <LayerItem key={index} options={item} onclick={clickHandler} />
            )}
            </div>
        </div>
    )
}

export default LayerControl