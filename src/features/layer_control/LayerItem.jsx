import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './LayerControl.module.scss'
import { addLayer } from './utils'
import { HexColorPicker } from 'react-colorful'
import { BlockPicker, CompactPicker, SketchPicker, SliderPicker } from 'react-color';


export default function LayerItem({options, onclick}){

    const [itemOptions, setItemOptions] = useState({
        bbox: undefined,
        rangeValue: 1,
        fillColor: '#4287f5',
        showFillPicker: false
    })

    const layer_instance = useRef(null)
    const searchOptions = useSelector(state=> state.search)
    const {filterOptions} = useSelector(state=>state.filter)
    const map = useSelector(state=> state.map.map)

    const controlsRef = useRef()

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
        if(options.show){
            layer_instance.current = showLayerOnMap()
            // layer_instance.current.setOpacity(itemOptions.rangeValue)
            
        } else {
            layer_instance.current?.remove()
        }
        
    }, [options.show])

    useEffect(_=>{
        if(itemOptions.rangeValue < 0 || !layer_instance.current) return;

        // layer_instance.current.setOpacity(itemOptions.rangeValue)
        layer_instance.current.setParams({
            env: `fillopacity:${itemOptions.rangeValue};fillcolor:${itemOptions.fillColor.replace('#', '')}`
        }) // não redesenha ainda
    }, [itemOptions.rangeValue, itemOptions.fillColor])

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

    const itemClickHandler = e =>{
        if(!controlsRef.current || (controlsRef.current != e.target && !controlsRef.current.contains(e.target))){
            onclick(options)    
        }
    }

    const inputRangeChange = (e) =>{
        setItemOptions(prev=>({
            ...prev,
            rangeValue: e.target.value
        }))
    }

    const inputColorChange = color =>{
        if(!color) return;
        setItemOptions(prev=>({
            ...prev,
            fillColor: color
        }))
    }
    
    const fillColorButtonClick = _ =>{
        let boolean = !itemOptions.showFillPicker
        setItemOptions(prev=>({
            ...prev,
            showFillPicker: boolean
        }))
    }

    const confirmColor = _ =>{
        setItemOptions(prev=>({
            ...prev,
            showFillPicker: false
        }))
    }

    return (
        <div className={`${styles.itemWrapper} ${options.show ? styles.active : ''}`} onClick={e=>itemClickHandler(e)}>
            <div className={styles.iconWrapper}>
                <div>LOADING</div>
                
            </div>
            <div className={styles.descWrapper}>
                <div>{options.layer}</div>
                {options.show ?
                    <div ref={controlsRef} className={styles.controlsContainer}>
                        <div style={{marginBottom: 5, display: 'flex', alignItems: 'center'}}>
                            <label>Opacidade</label>
                            <input type='range' value={itemOptions.rangeValue} min='0' max='1' step='.1' onChange={inputRangeChange} ></input>
                            {itemOptions.rangeValue*100}%
                        </div>
                        
                        {/* <div style={{width:20, height:20, backgroundColor: itemOptions.fillColor, borderRadius:5}}></div> */}
                        <div>
                            <label>Cor preenchimento</label>
                            <div style={{display: 'flex', gap: 5}}>
                                <div onClick={fillColorButtonClick} style={{width: 20, height: 20, backgroundColor: itemOptions.fillColor}}></div>
                                <div style={{flex:1}}><input value={itemOptions.fillColor} type='text' style={{width:'100%',borderRadius:3, heigth:'100%', border:'1px solid #e9e9e9'}}/></div>
                            </div>
                            {
                                itemOptions.showFillPicker && 
                                    <div style={{position: 'absolute', left: 0, top:0, transform: 'translateX(-100%)', padding:5, backgroundColor:'white'}}>
                                    <HexColorPicker 
                                        color={itemOptions.fillColor}
                                        onChange={inputColorChange} />
                                    <div style={{width: '100%', backgroundColor:'#a9ffa9', marginTop: 5}} onClick={confirmColor}>Confirmar</div>
                                    </div>
                            }
                        </div>
                    </div>
                    : <div className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                }
            </div>
        </div>
    )
}