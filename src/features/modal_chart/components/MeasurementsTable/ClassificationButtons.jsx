import { useEffect, useRef, useState } from "react"
import {  useSetMeasurementsClassificationMutation } from "@services/sibh_api"
import {useSelector} from 'react-redux'
import { isLogged,hasAnyOfRoles } from "@utils/authUtils"
import { useMemo } from "react"
import { toast } from "react-toastify"


const ClassificationButton = ({selectedRows, onStatusUpdate= _ =>{} }) =>{
    const [block, setBlock] = useState(false)
    const authOptions = useSelector(state=>state.auth)
    const [updateStatus, {data, error, isLoading, isSuccess, isError}] = useSetMeasurementsClassificationMutation()

    const status = useRef()
 
    const clickHandler = async cod_status =>{
        if(block) return;
        
        if(selectedRows.length > 200){
            toast.error('Selecione no máximo 200 registros por vez para alterar a classificação', {autoClose: 4000})
            return;
        }

        status.current = cod_status

        await toast.promise(
            updateStatus({measurement_ids: selectedRows.map(x=>x.measurement_id), status: cod_status}),
            {
                pending: 'Alterando classificação dos dados',
                success: 'Classificação alterada com sucesso',
                error: 'Erro ao alterar classificação dos dados'
            }
        )
        
    }

    const canEdit = useMemo(_=> isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']))

    useEffect(_=>{        
        setBlock(isLoading)
    },[isLoading])

    useEffect(_=>{
        if(isSuccess){
            onStatusUpdate(data, status.current)
            // toast.success('Classificação alterada com sucesso', {autoClose: 2000})
        }
    }, [isSuccess])

    return (
         canEdit && 
            selectedRows.length > 0 && <div style={{marginRight: 10, heigth: '100%', fontSize:10, cursor: 'pointer', textAlign:'center'}}>
                <div >Classificar Dados</div>
                <div style={{display: 'flex', gap:5,heigth: '100%', fontSize:12, cursor: 'pointer'}}>
                    <div style={{borderRadius:5, paddingRight: 5, paddingLeft: 5,backgroundColor: 'red', color: 'white'}} onClick={_=>clickHandler(4)}>Suspeito ({selectedRows.length})</div>
                    <div style={{borderRadius:5, paddingRight: 5, paddingLeft: 5,backgroundColor: '#797979ff', color: 'white'}} onClick={_=>clickHandler(3)}>Bruto ({selectedRows.length})</div>
                    <div style={{borderRadius:5, paddingRight: 5, paddingLeft: 5,backgroundColor: '#2ac937', color: 'white'}} onClick={_=>clickHandler(2)}>Pré-consistido ({selectedRows.length})</div>
                </div>
            </div>
    )
}

export default ClassificationButton