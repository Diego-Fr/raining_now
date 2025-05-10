import { useEffect, useRef, useState } from 'react'
import styles from './ModalChart.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import { fetchStationMeasurements } from '../../services/api'

import DatePicker from './DatePicker'
import { generatePluChart, generateFluChart } from './ModalChartUtils'
import { setEndDate, setStartDate, setGroupType } from '../../store/modalChartSlice'
import Loading from './Loading'
import Select from '../../components/form/select/Select'





const ModalChart = () =>{

    const [chartState, setChartState] = useState({
        isZoomed: false,
        noData:false,
        isLoading: false,
        show: false,
        mapContainerSize: 500,
    })

    const [stationName, setStationName] = useState()
    const [stationPrefix, setStationPrefix] = useState()
    const [measurements, setMeasurements] = useState([])

    const chartRef = useRef()
    const chartInstanceRef = useRef()
    const titleRef = useRef()
    const wrapperRef = useRef()

    const chartOptions = useSelector(state=>state.modalchart)
    const {counter,start_date, end_date, groupType } = chartOptions

    const stations = useSelector(state=> state.station.stations)
    const context = useSelector(state=> state.context.context)

    const dispatch = useDispatch()    

    const setMapTitle = (station_id) =>{
        let station = stations.find(x=> x.station_prefix_id.toString() === station_id.toString())
        
        setStationName(station.station_name || 'NOME DA ESTAÇÃO')
        setStationPrefix(station.prefix)
        
    }

    const getMeasurements = async _ =>{
        
        if(counter != 1){

            
            setChartState(state=>({
                ...state,
                show:true,
                isLoading: true
            }))
            
            
            setChartSize()
 
            if(chartInstanceRef.current){
                chartInstanceRef.current.destroy()
            }        
            
            setMapTitle(chartOptions.station_id)
            
            let res
            try{
                res = await fetchStationMeasurements(chartOptions.station_id, {start_date: start_date.format('YYYY-MM-DD HH:mm'), end_date: end_date.format('YYYY-MM-DD HH:mm'), groupType})
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
            if(context === 'rain'){
                chartInstanceRef.current = await generatePluChart(measurements, chartRef.current, zoomEventHandle) 
            } else if(context === 'level'){
                chartInstanceRef.current = await generateFluChart(measurements, chartRef.current, zoomEventHandle) 
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

    return (
        <div onMouseDown={_=>{outsideClick()}} className={`${styles.container} ${chartState.show ? styles.show : ''}`}>
            <div onMouseDown={e=>e.stopPropagation()} className={styles.wrapper} ref={wrapperRef}>
                <div ref={titleRef} className={styles.title_container}>
                    <div className={styles.title}><div>{stationName}</div><div className={styles.prefix}>{stationPrefix}</div></div>
                    <DatePicker/>
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
                <div className={styles.body} style={{height: chartState.mapContainerSize}}>
                    {chartState.isLoading ? 
                        <Loading text="Carregando"/> : 
                        <>
                            {!chartState.noData ? 
                            <>
                                <canvas ref={chartRef}></canvas>
                                {chartState.isZoomed && <button className={styles.resetZoomButton} onClick={_=>{resetChartZoom(false)}}>Remover Zoom</button>}
                            </> : <div>Sem dado</div>
                            }
                        </>
                        }
                </div>
            </div>
        </div>
    )
}

export default ModalChart