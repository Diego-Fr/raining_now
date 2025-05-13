import { ToastContainer, toast } from 'react-toastify'
import Select from '../../components/form/select/Select'
import { updateMeasurementStatus } from '../../services/api'
import styles from './StatusBox.module.scss'
import {useSelector} from 'react-redux'
import moment from 'moment'
import { useState } from 'react'

const StatusBox = opts =>{
    const {selectedMeasurement, statusBoxClose} = opts
    const [classificationTypeId, setClassificationTypeId] = useState()
    const context = useSelector(state=> state.context.context)
    const userToken = useSelector(state=> state.auth.token)
    const userRoles = useSelector(state=> state.auth.roles)

    const clickHandler = async () =>{
        try{
            if(classificationTypeId){
                await updateMeasurementStatus(selectedMeasurement.id, classificationTypeId,token)
                toast.success('Medição atualizada') 
            }
            
        } catch(e){
            toast.error("Erro ao atualizar status da medição!")
        }
        
    }

    const closeContainer = () =>{
        statusBoxClose()
    }

    const changeHandler = (e) =>{
        let value = e.values[0]

        if(value){
            setClassificationTypeId(value)
        }
        
    }

    return (
        selectedMeasurement && 
            <div className={`${styles.container} ${selectedMeasurement ? styles.show : ''}`}>
                
                <div className={styles.titleContainer}>
                    <div className={styles.title}>Alterar medição</div>
                    <button type='button' className={styles.closeButton} onClick={closeContainer}><span aria-hidden="true">×</span></button>
                </div>
                <div style={{padding:'10px', marginBottom: '10px'}}>
                    <div className={styles.stat}>Data: <strong>{selectedMeasurement.date}</strong></div>
                    <div className={styles.stat} style={{marginBottom:'20px'}}>Valor: <strong>{selectedMeasurement.y} {context === 'rain' ? 'mm' : 'cm'}</strong></div>

                    <div className={styles.label}>Classificação</div>
                    <Select 
                        
                        list={[{label: 'Consistido', value: 1},{label:'Pré-Consistido', value: 2}, {label: 'Bruto', value: 3}, {label: 'Suspeito',  value: 4}]}
                        placeholder={'Selecionar'}
                        field_id={'group_type'}
                        searchable={false}
                        selected={parseInt(selectedMeasurement.classification)}
                        multiple={false}
                        allowEmpty={false}
                        onchange={changeHandler}
                        
                    />

                    
                </div>
                <div>
                    <button className={styles.saveButton} onClick={clickHandler}>Salvar</button>
                </div>   
            </div>
            
    )
}

export default StatusBox