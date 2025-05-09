import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './Filter.module.scss'
import Select from '../../components/form/Select'
import { setFilterOption } from '../../store/filterSlice'
import { filterStations } from '../../store/stationSlice'
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
    },[filterOptions])

    useEffect(_=>{        
        setFiltersList({
            cities: buildUniqueList(stations, 'city_id', 'city'),
            ugrhis: buildUniqueList(stations, 'ugrhi_id', 'ugrhi_name'),
            subugrhis: buildUniqueList(stations, 'subugrhi_id', 'subugrhi_name'),
        })
    }, [stations])

    useEffect(_=>{        
        // dispatch(setFilterOption({field: 'city_id', value: ugrhiValue}))
    }, [ugrhiValue])

    const handleSelectChange = (value, name) =>{
        dispatch(setFilterOption({field: name, value: [value]}))
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                FILTRAR
            </div>
            <div className={styles.formGroup}>
                <label>Ugrhi</label>
                <Select 
                    list={filtersList.ugrhis}
                    placeholder={'Selecionar'}
                    
                    />
            </div>
            <div className={styles.formGroup}>
                <label>Subugrhi</label>
                <Select 
                    list={filtersList.subugrhis}
                    placeholder={'Selecionar'}
                    />
            </div>
            <div className={styles.formGroup}>
                <label>Município</label>
                <Select 
                    list={filtersList.cities}
                    placeholder={'Selecionar'}
                    value={ugrhiValue}
                    // onChange={e=>setUgrhiValue(e.value)}
                />
            </div>
        </div>
    )
}

export default Filter