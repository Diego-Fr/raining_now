import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './Filter.module.scss'
import Select from '../../components/form/select/Select'
import { setFilterOption } from '../../store/filterSlice'
import { filterStations } from '../../store/stationSlice'
import { FaFilter } from "react-icons/fa6";
import { IoFilterSharp } from "react-icons/io5";
// import Select from 'react-select'


const Filter = () =>{

    const dispatch = useDispatch()

    const filterOptions = useSelector(state => state.filter)
    
    const stations = useSelector(state => state.station.stations)

    const [ugrhiValue, setUgrhiValue] = useState()

    const [filtersList, setFiltersList] = useState({
        cities: [],
        ugrhis: [],
        subugrhis: [],
    })
    
    
    const buildUniqueList = (list, id_key, value_key) => {
        let objs = {}
        if(list){
            list.forEach(item=>{
                // if(item.show === true){
                    objs[item[id_key]] = item[value_key]
                // }
            })
            return Object.entries(objs).map(([value, label])=>({value, label}))
        } else {
            return []
        }
    }


    useEffect(_=>{               
        dispatch(filterStations())
    },[filterOptions.filterOptions])

    useEffect(_=>{        
        setFiltersList({
            cities: buildUniqueList(stations, 'city_id', 'city'),
            ugrhis: buildUniqueList(stations, 'ugrhi_id', 'ugrhi_name'),
            subugrhis: buildUniqueList(stations, 'subugrhi_id', 'subugrhi_name'),
        })
    }, [stations])

    useEffect(_=>{        
    }, [filtersList])

    const onChangeHandle = ({field, values}) =>{
        dispatch(setFilterOption({field, value: values}))
    }

    return (
        <div className={`${styles.container} ${filterOptions.filterFormOptions.show ? styles.show : ''}`}>
            <div className={styles.title}>
                <IoFilterSharp style={{marginRight: '10px'}} />
                FILTRO DE DADOS
                
            </div>
            <div className={styles.formGroup}>
                <label>Ugrhi</label>
                <Select 
                    list={filtersList.ugrhis}
                    placeholder={'Selecionar'}
                    field_id={'ugrhi_id'}
                    onchange={onChangeHandle}
                    orderBy={'desc'}
                    />
            </div>
            <div className={styles.formGroup}>
                <label>Subugrhi</label>
                <Select 
                    list={filtersList.subugrhis}
                    placeholder={'Selecionar'}
                    field_id={'subugrhi_id'}
                    onchange={onChangeHandle}
                    orderBy={'desc'}
                    />
            </div>
            <div className={styles.formGroup}>
                <label>Município</label>
                <Select 
                    list={filtersList.cities}
                    placeholder={'Selecionar'}
                    field_id={'city_id'}
                    onchange={onChangeHandle}
                    orderBy={'desc'}
                />
            </div>
        </div>
    )
}

export default Filter