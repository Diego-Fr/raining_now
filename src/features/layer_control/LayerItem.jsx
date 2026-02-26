import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './LayerControl.module.scss'
import { addLayer } from './utils'


export default function LayerItem({options}){

    const [itemOptions, setItemOptions] = useState({
        bbox: undefined
    })

    const layer_instance = useRef(null)
    const searchOptions = useSelector(state=> state.search)
    const {filterOptions} = useSelector(state=>state.filter)
    const map = useSelector(state=> state.map.map)

    //só pra pegar o bbox de maneira mais rápida. Poderia ser usado o cities do useGetCitiesQuery
    useEffect(_=>{
        if(searchOptions.type != options.type) return;

        setItemOptions(prev => ({
            ...prev,
            bbox: searchOptions.bbox
        }))

        
    },[searchOptions])

    useEffect(_=>{
        
        if(searchOptions.type === options.type){
            // layer_instance.current?.remove()
            
            if(filterOptions[options.station_field] && filterOptions[options.station_field].length > 0){
                let l = showLayerOnMap()
                
                layer_instance.current = l
            }

            if(itemOptions.bbox){
                map.fitBounds(searchOptions.bbox)
            }

        } else if(layer_instance.current){
            layer_instance.current.remove()
        }
        
    },[filterOptions])

    useEffect(_=>{
        console.log('lcikc');
        
        if(options.show){
            layer_instance.current = showLayerOnMap()
        } else {
            console.log('aqui');
            
            layer_instance.current?.remove()
        }
        
    }, [options.show])

    const prepareCod = (cod) =>{
        let c = parseInt(cod)
        c = c < 1000 ? (c / 10).toFixed(1) : (c / 100).toFixed(2)
        return c
    }    

    const showLayerOnMap = ()=>{
        if(searchOptions.type){
            return addLayer(map, options.layer, `${options.field} in (${searchOptions.type != 'subugrhi' ? filterOptions[options.station_field] : prepareCod(filterOptions[options.station_field])})`, {style: 'municipios_sp_raining_now'})
        } else {
            return addLayer(map, options.layer, '')
        }
        
    }

    return (
        <>
            <div className={styles.iconWrapper}>
                <div>LOADING</div>
                
            </div>
            <div className={styles.descWrapper}>
                <div>{options.layer}</div>
                <div className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            </div>
        </>
    )
}