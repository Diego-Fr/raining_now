import { useEffect, useRef, useState } from 'react'
import styles from './ModalChart.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import { fetchStationMeasurements } from '../../services/api'

import DatePicker from './DatePicker'
import { generatePluChart, generateFluChart } from './ModalChartUtils'
import { setEndDate, setStartDate, setGroupType } from '../../store/modalChartSlice'
import Loading from './Loading'
import Select from '../../components/form/select/Select'
import StatusBox from './StatusBox'
import { hasAnyOfRoles, isLogged } from '../../utils/authUtils'
import { colorByMeasurementClassification } from '../../utils/measurementUtils'
import { FaEye } from "react-icons/fa6";
import Visibility from './components/Visibility'
import MeasurementsTable from './components/MeasurementsTable'


const ModalChart = () =>{

    const [chartState, setChartState] = useState({
        isZoomed: false,
        noData:false,
        isLoading: false,
        show: false,
        mapContainerSize: 500,
        selectedMeasurement: null
    })

    const [stationInfo, setStationInfo] = useState({
        station_name: '',
        station_prefix: '',
        station_owner: '',
        lat: '', lng: ''
    })

    const [modalOptions, setModalOptions] = useState({
        type: 'table'
    })

    const [measurements, setMeasurements] = useState([])

    const chartRef = useRef()
    const chartInstanceRef = useRef()
    const titleRef = useRef()
    const wrapperRef = useRef()

    const chartOptions = useSelector(state=>state.modalchart)
    const {counter,start_date, end_date, groupType } = chartOptions

    const stations = useSelector(state=> state.station.stations)
    const context = useSelector(state=> state.context.context)
    const authOptions = useSelector(state=>state.auth)

    const dispatch = useDispatch()


    const setStation = (station_id) =>{
        let station = stations.find(x=> x.station_prefix_id.toString() === station_id.toString())

        setStationInfo(state=>({
            ...state,
            station_name:station.station_name || 'NOME DO POSTO',
            station_prefix: station.prefix,
            station_owner: station.station_owner,
            extravasation: station.extravasation,
            emergency: station.emergency,
            alert: station.alert,
            attention: station.attention
        }))
        
    }

    const getMeasurements = async _ =>{
        
        if(counter != 1){

            
            setChartState(state=>({
                ...state,
                show:true,
                isLoading: true,
                selectedMeasurement: false
            }))
            
            
            setChartSize()
 
            if(chartInstanceRef.current){
                chartInstanceRef.current.destroy()
            }        
            
            setStation(chartOptions.station_id)
            
            let res
            try{
                res = await fetchStationMeasurements(chartOptions.station_id, {start_date: start_date.format('YYYY-MM-DD HH:mm'), end_date: end_date.format('YYYY-MM-DD HH:mm'), groupType, token: authOptions.token})
            } catch(e){
                console.log('Erro ao buscar dados do posto');
            }

            if(res && res.length > 0){
                //esconderá a mensagem de falta de dados
                setChartState(state => ({
                    ...state,
                    noData: false
                }))

                setMeasurements(res)
            } else {
                //exibirá uma mensagem no caso de falta de dados
                setChartState(state => ({
                    ...state,
                    noData: true
                }))
            }
            
            //aqui vai disparar a geração do chart com os novos dados
            setChartState(state=>({
                ...state, isLoading: false
            }))
        }
    }
    
    const zoomEventHandle = _ =>{        
        setChartState(state => ({
            ...state,
            isZoomed: true
        }))
    }

    const generateChart = async _ =>{
        if(counter != 1){

            setChartState(state=>({
                ...state,
                selectedMeasurement: null
            }))

            if(context === 'rain'){
                chartInstanceRef.current = await generatePluChart(measurements, chartRef.current, zoomEventHandle,chartSeriesClick) 
            } else if(context === 'level'){
                chartInstanceRef.current = await generateFluChart(measurements, chartRef.current, zoomEventHandle, stationInfo) 
            }
            
        }                  
    }

    const setChartSize = async () =>{
        
        await new Promise(resolve => setTimeout(resolve, 1)) //workaround

        setChartState(state=>({
            ...state, mapContainerSize: wrapperRef.current.offsetHeight - titleRef.current.offsetHeight
        }))
    }

    useEffect(_=>{
        if(!chartState.isLoading){            
            generateChart()
        }
    }, [chartState.isLoading])

    //alterando a cor da barra para sugerir seleção no momento do click caso o usuário esteja logado e o dado nao esteja agrupado
    useEffect(_=>{
        if(chartState.selectedMeasurement && isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']) && groupType === 'minute'){
            
            let colors = []

            chartInstanceRef.current.data.datasets[0].data.forEach(item=>{
                if(item.x === chartState.selectedMeasurement.x){                    
                    colors.push('blue')
                    
                } else {
                    colors.push(colorByMeasurementClassification(item.classification))
                }
            })
            chartInstanceRef.current.data.datasets[0].backgroundColor = colors;

            // Atualize o gráfico
            chartInstanceRef.current.update();
        }        
    },[chartState.selectedMeasurement])

    useEffect(_=>{
        dispatch(setStartDate())
        dispatch(setEndDate())
        // generateChart()
    }, [counter])

    // useEffect(_=>{
        
        
    // }, [start_date, end_date])

    useEffect(_=>{        
        getMeasurements()
    },[start_date, end_date, groupType])


    const outsideClick = () =>{
        setChartState(state=>({
            ...state, show: false
        }))
    }

    const resetChartZoom = () =>{
        setChartState(state=>({
            ...state,
            isZoomed: false
        }))
        chartInstanceRef.current.resetZoom()
    }

    const groupSelectOnChange = values =>{
        let item = values.values[0] //sempre retorna array

        dispatch(setGroupType(item))
    }

    const chartSeriesClick = (item) =>{
        // console.log(item);
        
        if(item){
            if(context === 'rain'){                
                setChartState(state=>({
                    ...state,
                    selectedMeasurement: item
                }))
            }
        }
    }

    const statusBoxClose = () =>{
        setChartState(state=>({
            ...state,
            selectedMeasurement: undefined
        }))
    }

    return (
        <div onMouseDown={_=>{outsideClick()}} className={`${styles.container} ${chartState.show ? styles.show : ''}`}>
            <div onMouseDown={e=>e.stopPropagation()} className={styles.wrapper} ref={wrapperRef}>
                <div ref={titleRef} className={styles.title_container}>
                    <div className={styles.title_wrapper}>
                        <div className={styles.title}>
                            <div className={styles.name}>{stationInfo.station_name}</div>
                            <div className={styles.prefix}>{stationInfo.station_prefix} - {stationInfo.station_owner}</div>
                            {isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']) &&<div className={styles.public}><FaEye /> <div style={{marginLeft:5}}><Visibility/></div></div>}
                        </div>
                    </div>
                    <div className={styles.fieldsWrapper}>
                        <DatePicker/>
                        <div style={{padding: '20px'}}>
                            <Select 
                                label='Agrupamento'
                                list={[{label: 'Coleta', value: 'minute'},{label:'Hora', value: 'hour'}, {label: 'Dia', value: 'day'}]}
                                placeholder={'Selecionar'}
                                field_id={'group_type'}
                                searchable={false}
                                selected='minute'
                                multiple={false}
                                allowEmpty={false}
                                onchange={groupSelectOnChange}
                            />
                        </div>
                        
                    </div>
                    {isLogged(authOptions) && hasAnyOfRoles(authOptions, ['dev', 'admin']) && groupType === 'minute' &&  
                        <StatusBox selectedMeasurement={chartState.selectedMeasurement} statusBoxClose={statusBoxClose}/>
                    }
                    
                    
                </div>
                <div className={styles.body} style={{height: chartState.mapContainerSize}}>
                    {chartState.isLoading ? 
                        <Loading text="Carregando"/> : 
                        <>
                            {
                                modalOptions.type === 'chart' ?
                                    !chartState.noData ? 
                                        <>
                                            <canvas ref={chartRef}></canvas>
                                            {chartState.isZoomed && <button className={styles.resetZoomButton} onClick={_=>{resetChartZoom(false)}}>Remover Zoom</button>}
                                        </> : <div>Sem dado</div>
                                    :<MeasurementsTable measurements={measurements}></MeasurementsTable>
                            }
                        </>
                        }
                </div>
            </div>
        </div>
    )
}

export default ModalChart