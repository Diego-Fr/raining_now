import { useEffect, useState } from "react"
import {  useSetMeasurementsClassificationMutation } from "@services/sibh_api"
import {useSelector} from 'react-redux'
import { isLogged,hasAnyOfRoles } from "@utils/authUtils"
import { useMemo } from "react"


const ClassificationButton = ({selectedRows}) =>{
    const [block, setBlock] = useState(false)
    const authOptions = useSelector(state=>state.auth)
    const [updateStatus, {isLoading, isSuccess, isError}] = useSetMeasurementsClassificationMutation()
 
    const clickHandler = async status =>{
        if(block) return;
        
        await updateStatus({measurement_ids: selectedRows.map(x=>x.measurement_id), status: status})
    }

    const canEdit = useMemo(_=> isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']))

    useEffect(_=>{        
        setBlock(isLoading)
    },[isLoading])

    return (
         canEdit && 
            selectedRows.length > 0 && <div style={{heigth: '100%', fontSize:10, cursor: 'pointer', textAlign:'center'}}>
                <div >Classificar</div>
                <div style={{display: 'flex', gap:5,heigth: '100%', fontSize:10, cursor: 'pointer'}}>
                    <div style={{borderRadius:5, paddingRight: 5, paddingLeft: 5,backgroundColor: 'blue', color: 'white'}} onClick={_=>clickHandler(4)}>Suspeito ({selectedRows.length})</div>
                    <div style={{borderRadius:5, paddingRight: 5, paddingLeft: 5,backgroundColor: '#797979ff', color: 'white'}} onClick={_=>clickHandler(3)}>Bruto ({selectedRows.length})</div>
                    <div style={{borderRadius:5, paddingRight: 5, paddingLeft: 5,backgroundColor: '#2ac937', color: 'white'}} onClick={_=>clickHandler(2)}>Pré-consistido ({selectedRows.length})</div>
                </div>
            </div>
    )
}

export default ClassificationButton