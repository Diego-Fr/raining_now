import { useEffect, useRef, useState } from 'react'
import styles from './SearchInput.module.scss'
import { getCityByPoint, searchAddress } from '../../../services/api'
import {  setSearchProps } from '../../../store/searchSlice'
import {useDispatch} from 'react-redux'
import { getBoundingBox } from '../../layer_control/utils'


const SearchInput = () =>{

    const [inputAddressValue, setInputAddressValue] = useState('')

    const abortControllerRef = useRef(null)
    const dispatch = useDispatch()

    const [citiesList, setCitiesList] = useState([{name: 'teste'}])

    useEffect(_=>{
        //psequisar só quando tiver ao menos 3 caracteres
        if(inputAddressValue.length > 2){
            searchText()
        }
    },[inputAddressValue])

    /*
        1 - Busca texto da caixa no geolocalizador
        2 - Região encontrada é buscada no geonode para informações de cod
        3 - dispatch para uso de outros components (filter e layerControl)
    */
    const searchText = async () =>{

        //se ja tem uma request ativa de busca, cancelar
        if(abortControllerRef.current){
            abortControllerRef.current.abort()
        }

        try{
            abortControllerRef.current = new AbortController()

            //axios usando abortcontroller como signal param
            // let results = await searchAddress(inputAdressValue, abortControllerRef.current)
            let results = await searchAddress(inputAddressValue,abortControllerRef.current)
            
            //limpando controller para indicar que n tem request ativa
            abortControllerRef.current = null

            if (results?.data?.features?.length > 0) {    

                //filtrando apenas resultados com o valor são paulo na descrição
                results = filterResults(results.data.features).slice(0,5)
                
                // setList(results)

                if(results.length > 0){
                    setCitiesList(results.map(x=>({name:x.properties.name, lat: x.geometry.coordinates[1], lng:x.geometry.coordinates[0]})))                    
                    
                }
                // console.log(results);
                
            }

            // setState('loaded')
        } catch (e){
            if(e.message != 'canceled'){
                // setState('')
            }
        
        }    
    }

    const filterResults = list => list.filter(x=>x.properties.state === 'São Paulo' && ['city', 'town', 'village', 'municipality'].includes(x.properties.osm_value))

    const clickHandler = async item => {
        console.log(item);
        
        //pegando informações do ponto, como nome e cod_ibge do muni
        let res = await getCityByPoint(item.lat, item.lng)

        if(res){            
            //dispatch desse lat lng para que outros componentes escutem
            dispatch(setSearchProps({text:inputAddressValue, cod: res.features[0].properties.cd_mun, bbox:getBoundingBox(res.features[0].geometry.coordinates[0][0]),  name: res.features[0].properties.nm_mun }))
        }

        setCitiesList([])
    }
    

    return (
        <div className={styles.wrapper}>
            <div className={styles.inputContainer}>
                <input 
                    className={styles.input}
                    onChange={e=>setInputAddressValue(e.target.value)}
                    value={inputAddressValue}
                    placeholder="Pesquisar região"
                    />
                <div className={styles.button}>P</div>
            </div>
            <div className={styles.listContainer}>{citiesList.map((item, index)=><div key={index} onClickCapture={_=>clickHandler(item)}>{item.name}</div> )}</div>
        </div>
    )
}

export default SearchInput