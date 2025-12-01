import { useEffect, useState } from "react"
import { useSelector} from 'react-redux'
import { isLogged,hasAnyOfRoles } from "../../../utils/authUtils"
import {useSetStationPublicMutation} from '../../../services/sibh_api'
import {  toast } from 'react-toastify'

import moment from "moment"


const Visibility = () =>{

    const authOptions = useSelector(state=>state.auth)
    const [visible, setVisible] = useState(true)
    const [state, setState] = useState('default')
    const chartOptions = useSelector(state=>state.modalchart)
    const [updatePublic, { isLoading, isSuccess, isError, isFetching }] = useSetStationPublicMutation();
    const [block, setBlock] = useState(false)
    

    const itemsList = [12,24,48,72]

    const itemClick = async value =>{
        // ((value && value != 99) ? ...{public_control:  moment().utc().add(value, 'hours').format('YYYY-MM-DD HH:mm')} : ...{})
        // console.log(moment());
        if(block) return;
        await toast.promise(
            updatePublic({id:chartOptions.station_id, data: {public: value === 99 ? 'true' : 'false', ...((value && value != 99) ? {public_control:  moment().utc().add(value, 'hours').format('YYYY-MM-DD HH:mm')} : {}) }}),
            {
                pending: 'Alterando visibilidade do posto',
                success: 'Visibilidade do posto alterada',
                error: 'Erro ao alterar visibilidade do posto'
            }
        )
        
        setVisible(value === 99 ? true : false)
    }

    useEffect(_=>{
        // console.log(isLoading);
        setBlock(isLoading)
    },[isLoading])



    useEffect(_=>{
        setState('default')
        setVisible(true)
    }, [chartOptions.station_id])

    return (
        isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']) && 
            state === 'default' ? 
            <div onPointerDown={_=>setState('alter')} style={{cursor: 'pointer', color:'rgba(21, 117, 226, 0.7)'}}>Alterar visibilidade</div>
            : state === 'alter' ? 
            <div style={{display: 'flex', gap: 5}}>
                <div>Ocultar por:</div>
                {itemsList.map((x, index)=> 
                    <div style={{backgroundColor: 'rgb(23, 59, 83)', borderRadius: 2, paddingLeft: 5, paddingRight:5, color:'white', cursor:'pointer'}} key={index} onPointerDown={_=>itemClick(x)}>{x}h</div>)
                }
                { !visible && <div style={{backgroundColor: 'rgba(39, 145, 79, 1)', borderRadius: 2, paddingLeft: 5, paddingRight:5, color:'white', cursor:'pointer'}} onPointerDown={_=>itemClick(99)}>Visível</div> }
                <div onPointerDown={_=>setState('default')} style={{borderRadius: 2, cursor: 'pointer', backgroundColor:'gray', paddingLeft: 5, paddingRight:5, color:'white'}}>Cancelar</div>
            </div>
            :
            <>
                <div>12 horas</div>
                <div>1 dia</div>
                <div>2 dias</div>
            </>


        
    )
}

export default Visibility