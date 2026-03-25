import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './LayerControl.module.scss'
import { addLayer } from './utils'
import { HexColorPicker } from 'react-colorful'
import { AiOutlineLoading3Quarters } from "react-icons/ai";




export default function LayerItem({options, onclick}){
    
    const [itemOptions, setItemOptions] = useState({
        bbox: undefined,
        style: {
            rangeValue: .2,
            strokeRangeValue: .8,
            fillColor: '#4287f5',
            strokeColor: '#4287f5',
            strokeWidth:1,
            ...(options.style || {})
        },
        
        showFillPicker: false,
        pickerName: 'stroke',
        loadingLayer:true
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
            
            layer_instance.current?.remove()
            
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
        
    },[filterOptions.cod_ibge, filterOptions.ugrhi_cod, filterOptions.subugrhi_cod])

    useEffect(_=>{
        if(!map) return;
        if(options.show){
            layer_instance.current = showLayerOnMap()
            // layer_instance.current.setOpacity(itemOptions.rangeValue)
            
        } else {
            layer_instance.current?.remove()
        }
        
    }, [options.show])

    useEffect(_=>{
        if(itemOptions.style.rangeValue < 0 || !layer_instance.current) return;

        // layer_instance.current.setOpacity(itemOptions.rangeValue)
        layer_instance.current.setParams({
            env: `fillopacity:${itemOptions.style.rangeValue};fillcolor:${itemOptions.style.fillColor.replace('#', '')};stroke:${itemOptions.style.strokeColor.replace('#', '')};strokeopacity:${itemOptions.style.strokeRangeValue}`
        }) // não redesenha ainda
    }, [itemOptions.style.rangeValue, itemOptions.style.fillColor, itemOptions.style.strokeColor, itemOptions.style.strokeRangeValue])

    //loaading do mapa inicial, colocar camadas definidas como show=true (default)
    useEffect(_=>{
        if(!map || !options.show) return;        
        layer_instance.current = showLayerOnMap()
        
    }, [map])

    const onLoading = () =>{
        setItemOptions(prev => ({
            ...prev, loadingLayer: true
        }))
    }

    const onLoad = () =>{
        setItemOptions(prev => ({
            ...prev, loadingLayer: false
        }))
    }

    const prepareCod = (cod) =>{
        let c = parseInt(cod)
        c = c < 1000 ? (c / 10).toFixed(1) : (c / 100).toFixed(2)
        return c
    }    

    const showLayerOnMap = ()=>{
        if(searchOptions.type){
            return addLayer(map, options.layer, `${options.field} in (${searchOptions.type != 'subugrhi' ? filterOptions[options.station_field] : prepareCod(filterOptions[options.station_field])})`, {style:'raining_now_default_layer'}, {onLoading,onLoad})
        } else {
            return addLayer(map, options.layer, '',{style:'raining_now_default_layer', env: `fillopacity:${itemOptions.style.rangeValue};fillcolor:${itemOptions.style.fillColor.replace('#', '')};stroke:${itemOptions.style.strokeColor.replace('#', '')};strokeopacity:${itemOptions.style.strokeRangeValue}`}, {onLoading,onLoad})
        }
        
    }

    const itemClickHandler = e =>{
        if(!controlsRef.current || (controlsRef.current != e.target && !controlsRef.current.contains(e.target))){
            onclick(options)    
        }
    }

    const inputRangeChange = (e, field='rangeValue') =>{
        setItemOptions(prev=>({
            ...prev,
            style: {...prev.style, [field]: e.target.value}
        }))
    }

    const inputColorChange = (color,name) =>{
        // let field = name === 'stroke' ? 'strokeColor' : 'fillColor'
        let field = itemOptions.pickerName === 'stroke' ? 'strokeColor' : 'fillColor'
        
        
        if(!color) return;
        
        
        setItemOptions(prev=>({
            ...prev,
            style: {...prev.style, [field]: color}
        }))
    }
    
    const fillColorButtonClick = pickerName =>{
        let boolean = !itemOptions.showFillPicker
        setItemOptions(prev=>({
            ...prev,
            showFillPicker: boolean,
            pickerName
        }))
    }

    const confirmColor = _ =>{
        setItemOptions(prev=>({
            ...prev,
            showFillPicker: false
        }))
    }

    const t = (text) =>{
        switch(text){
            case 'municipios_sp': return 'municípios';
            case 'subugrhis_sp': return 'subugrhis';
            case 'ugrhis_sp': return 'ugrhis';
            case 'hidrografia_completa': return 'hidrografia'
            case 'limiteestadualsp': return 'limite estadual'
            default: return text
        }
    }

    return (
        <div className={`${styles.itemWrapper} ${options.show ? styles.active : ''}`} onClick={e=>itemClickHandler(e)}>
            {/* <div className={styles.iconWrapper}>
                <img src={options.icon || ''} style={{width: '100px'}}></img>
            </div> */}
            <div className={styles.descWrapper}>
                <div style={{textTransform: 'uppercase', fontWeight: 500}}>{options.show && itemOptions.loadingLayer && <AiOutlineLoading3Quarters className={styles.rotate} />} {t(options.layer)} {options.show ? <span style={{color: '#0c7bb3', fontSize: 'x-small', float: 'right'}}>{'exibindo'}</span> : ''}</div>
                {options.show &&
                    <div ref={controlsRef}>
                        {options.strokeControl?.show && 
                            <div className={styles.controlsContainer} style={{marginBottom: 5}}>
                                <div style={{fontSize: 'x-small'}}>Contorno</div>
                                <div style={{marginBottom: 5, display: 'flex', alignItems: 'center'}}>
                                    <label>Opacidade</label>
                                    <input type='range' value={itemOptions.style.strokeRangeValue} min='0' max='1' step='.05' onChange={e=>inputRangeChange(e, 'strokeRangeValue')} ></input>
                                    <label>{(itemOptions.style.strokeRangeValue*100).toFixed(0)}%</label>
                                </div>
                                <div>
                                    <div style={{display: 'flex', gap: 5}}>
                                        <div onClick={_=>fillColorButtonClick('stroke')} style={{width: 20, height: 20, backgroundColor: itemOptions.style.strokeColor}}></div>
                                        <div><input value={itemOptions.style.strokeColor} type='text' style={{width:'100%',borderRadius:3, heigth:'100%', border:'1px solid #e9e9e9'}}/></div>
                                    </div>
                                </div>
                            </div>
                        }
                        {options.fillControl?.show && 
                            <div className={styles.controlsContainer}>
                                <div style={{fontSize: 'x-small'}}>Preenchimento</div>
                                <div style={{marginBottom: 5, display: 'flex', alignItems: 'center'}}>
                                    <label>Opacidade</label>
                                    <input type='range' value={itemOptions.style.rangeValue} min='0' max='1' step='.05' onChange={inputRangeChange} ></input>
                                    <label>{(itemOptions.style.rangeValue*100).toFixed(0)}%</label>
                                </div>
                                <div>
                                    <div style={{display: 'flex', gap: 5}}>
                                        <div onClick={_=>fillColorButtonClick('fill')} style={{width: 20, height: 20, backgroundColor: itemOptions.style.fillColor}}></div>
                                        <div><input value={itemOptions.style.fillColor} type='text' style={{width:'100%',borderRadius:3, heigth:'100%', border:'1px solid #e9e9e9'}}/></div>
                                    </div>
                                    {
                                        itemOptions.showFillPicker && 
                                            <div style={{position: 'absolute', left: 0, top:0, transform: 'translateX(-100%)', padding:5, backgroundColor:'white'}}>
                                            <HexColorPicker 
                                                color={itemOptions.style.fillColor}
                                                onChange={e=>inputColorChange(e, itemOptions.pickerName)} />
                                            <div style={{width: '100%', color: 'white', backgroundColor:'#3593b9', marginTop: 5, textAlign: 'center', borderRadius: 5}} onClick={confirmColor}>Confirmar</div>
                                            </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    
                    // : <div className={styles.desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                }
            </div>
        </div>
    )
}