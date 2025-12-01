import {useSelector} from 'react-redux'
import { useGetValuesQuery } from '../../services/unisanta_api'
import { useEffect } from 'react'

const Tide = () =>{
    const map = useSelector(state=>state.map.map)

    const {data: tides, isLoading} = useGetValuesQuery()

    const getTides = async _ =>{
        console.log(tides);
        
    }

    useEffect(_=>{
        console.log(tides,isLoading);
        
    }, [tides,isLoading])


    return (
        <>
        </>
    )
}

export default Tide