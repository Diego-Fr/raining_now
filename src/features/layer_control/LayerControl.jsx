import styles from './LayerControl.module.scss'
import layerControlList from '../../data/layerControlList'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import { showLayer } from './utils'

const LayerControl = _ =>{

    const map = useSelector(state=> state.map.map)
    const filterOptions = useSelector(state=>state.filter)
    const stations = useSelector(state=> state.station.stations)
    const [layersShowing, setLayersShowing] = useState({
        'city': {show: false}
    })

    const clickHandler = layer =>{
        // console.log(id,map);
        // if(!layer.layer){
        //     let l = showLayer(map, layer.layer_name, "cd_mun='3550308'")
        //     layer.layer = l
        // } else {
        //     layer.layer.remove()
        //     layer.layer = undefined
        // }

        let copy = Object.assign(layersShowing[layer.id])

        
        setLayersShowing({...layersShowing, copy})

    }

    useEffect(_=>{
        
    }, [layersShowing])

    useEffect(_=>{
        let {city_id, ugrhi_id, subugrhi_id} = filterOptions
        let a = {city_id, ugrhi_id, subugrhi_id}
        console.log(a);
        
        
        let counter = Object.entries(a).filter(([id, array])=>array?.length > 0)
        if(counter.length === 1){
            let item = counter[0][1]
            let key = counter[0][0]
            let items = {}

            stations.forEach(station=>{
                if(item.includes(station.city_id.toString())){
                    items[station.cod_ibge] = undefined
                }
                
            })

            Object.keys(items) //identificaçao dos items
            
            if(key === 'city_id'){
                if(layersShowing['city_id']){
                    
                    layersShowing['city_id'].remove()
                    layersShowing['city_id'] = undefined
                }

                let l = showLayer(map, 'geonode:municipios_sp', Object.keys(items).map(x=> `cd_mun='${x}'` ).join(' and '))

                layersShowing['city_id'] = l

            }
            

        }
        
        
    }, [filterOptions])

    return (
        <div className={styles.container}>
            {layerControlList.list.map((item, index) => <div key={index}><input type='checkbox' onClick={_=>clickHandler(item)}></input>{item.title}</div> )}
        </div>
    )
}

export default LayerControl