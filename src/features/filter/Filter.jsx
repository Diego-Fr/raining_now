import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './Filter.module.scss'
import Select from '../../components/form/Select'
import { setFilterOption } from '../../store/filterSlice'
import { filterStations } from '../../store/stationSlice'


const Filter = () =>{

    const dispatch = useDispatch()

    const filterOptions = useSelector(state => state.filter)
    const stations = useSelector(state => state.station.stations)
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
            return Object.entries(objs).map(([id, value])=>({id, value}))
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

    const handleSelectChange = (value, name) =>{
        dispatch(setFilterOption({field: name, value: [value]}))
    }

    return (
        <div className={styles.container}>
            
            <Select 
                list={filtersList.ugrhis}
                onChange={handleSelectChange}
                name='ugrhi_id'
                />
            <Select 
                list={filtersList.subugrhis}
                onChange={handleSelectChange}
                name='subugrhi_id'
                />
            <Select 
                list={filtersList.cities}
                onChange={handleSelectChange}
                name='city_id'
                />
        </div>
    )
}

export default Filter