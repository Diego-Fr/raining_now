import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './SearchInput.module.scss'
import { getCityByPoint, searchAddress } from '../../../services/api'
import {  setSearchProps } from '../../../store/searchSlice'
import {useDispatch} from 'react-redux'
import { getBoundingBox } from '../../layer_control/utils'
import { useGetCitiesQuery,useGetSubugrhisQuery } from '../../../services/sibh_api'
import { FaTimes } from "react-icons/fa";



const SearchInput = () =>{

    const [inputAddressValue, setInputAddressValue] = useState('')

    const abortControllerRef = useRef(null)
    const dispatch = useDispatch()

    const [optionsList, setOptionsList] = useState([])

    const {data: cities, isError, isLoading} = useGetCitiesQuery()
    const {data: subugrhis} = useGetSubugrhisQuery()

    const [selectedItem, setSelectedItem] = useState()

    const citiesList = useMemo(_=>{
        if (!cities) return []
        return cities.map(x=>({...x, name_normalize:x.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}))
        // return cities.map(x=>x)
    })

    const subugrhisList = useMemo(_=>{
        if (!subugrhis) return []
        return subugrhis.map(x=>({...x, name_normalize:x.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}))
    })

    useEffect(_=>{
        //psequisar só quando tiver ao menos 3 caracteres
        if(inputAddressValue.length > 2){
            searchText()
        }
    },[inputAddressValue])

    /*
        A idéia é procurar o valor digitado na lista de cidades, ugrhis e subugrhis já baixadas
        Comparar com os campos 'nome' e 'códigos' dessas entidades
        Se encontrar, montar uma lista composta para o usuário selecionar
    */

    const searchArea = async () =>{
        
        let value = inputAddressValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        let obj = []
        if(citiesList){
            //procurar o valor digitado na lista de cidades
            let list = citiesList.filter(x=>x.name_normalize.includes(value)).map(x=>({...x, cod:x.cod_ibge, type: 'município'}))
            obj.push(...list)
        }

        if(subugrhisList){
            //procurar o valor digitado na lista de subugrhis
            let list = subugrhisList.filter(x=>x.name_normalize.includes(value)).map(x=>({...x, type: 'subugrhi'}))
            obj.push(...list)
        }
        
        setOptionsList(obj)

    }
    

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
            searchArea()

            // setState('loaded')
        } catch (e){
            if(e.message != 'canceled'){
                // setState('')
            }
        
        }    
    }

    const clickHandler = async item => {

        dispatch(setSearchProps({text:inputAddressValue, cod: item.cod, bbox:item.bbox_json,  name: item.name,  type: item.type }))

        setInputAddressValue(item.name)
        
        setTimeout(_=>{
            setOptionsList([])
        }, 100)
        
        setSelectedItem(item)


    }

    const clearClickHandler = _ =>{
        setInputAddressValue('')
        setOptionsList([])
        dispatch(setSearchProps({text: null, cod: null, bbox: null,  name: null, type: null}))
        setSelectedItem(undefined)
    }
    

    return (
        (!isLoading && !isError) &&
        <div className={styles.wrapper}>
            <div className={styles.inputContainer}>
                <input 
                    className={styles.input}
                    onChange={e=>setInputAddressValue(e.target.value)}
                    value={inputAddressValue}
                    placeholder="Buscar cidade / subugrhi"
                    readOnly={selectedItem !== undefined}
                    style={{cursor: selectedItem !== undefined ? 'auto' : 'auto'}}
                    />
                {(inputAddressValue.length > 0 || selectedItem) && <div className={styles.button} onClickCapture={clearClickHandler}><FaTimes/></div>}
                
            </div>
            <div className={styles.listContainer}>{optionsList.map((item, index)=><div key={index} onClickCapture={_=>clickHandler(item)} className={styles.item}><div className={styles.title}>{item.name}</div><div className={styles.type}>{item.type}</div></div> )}</div>
        </div>
    )
}

export default SearchInput