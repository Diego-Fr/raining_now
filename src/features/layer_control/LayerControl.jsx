import styles from './LayerControl.module.scss'
import layerControlList from '../../data/layerControlList'
import {useSelector} from 'react-redux'

const LayerControl = _ =>{

    const map = useSelector(state=> state.map.map)

    const clickHandler = layer =>{
        // console.log(id,map);
        if(!layer.layer){
            let l = L.tileLayer.wms('https://geodados.daee.sp.gov.br/geoserver/ows', {
                layers: layer.layer_name,
                format: 'image/png',
                transparent: true,
                // styles: 'estadual_chuva_agora',
                attribution: '© Seu GeoNode'
            }).addTo(map)
            layer.layer = l
        } else {
            layer.layer.remove()
            layer.layer = undefined
        }
        

        
    }

    return (
        <div className={styles.container}>
            {layerControlList.list.map((item, index) => <div key={index}><input type='checkbox' onClick={_=>clickHandler(item)}></input>{item.title}</div> )}
        </div>
    )
}

export default LayerControl