import { useEffect, useRef, useState } from 'react'
import styles from './ModalChart.module.scss'
import {useSelector} from 'react-redux'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale } from 'chart.js'
import { fetchStationMeasurements } from '../../services/api'
import moment from 'moment'
import 'chartjs-adapter-moment';
import DatePicker from './DatePicker'



Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend,TimeScale)

const ModalChart = () =>{

    const [show, setShow] = useState(false)
    const [tamanho, setTamanho] = useState(500)
    const chartRef = useRef()
    const chartInstanceRef = useRef()
    const counter = useSelector(state=>state.modalchart.counter)
    const chartOptions = useSelector(state=>state.modalchart)
    const titleRef = useRef()
    const wrapperRef = useRef()

    useEffect(_=>{

        const start = async _ =>{
            if(counter != 1){
                setShow(true)
                // setTimeout(_=>{
                    if(chartRef.current){
                        if(chartInstanceRef.current){
                            chartInstanceRef.current.destroy()
                        }
                        
                        let measurements = await fetchStationMeasurements(chartOptions.station_id)
    
                        let data = measurements.map(m=> ({x: moment(m.date, 'YYYY/MM/DD HH:mm').utc().toDate(), y:m.value})).sort((x,y)=> x.x - y.x )
    
                        const ctx = chartRef.current.getContext('2d')

                        setTamanho(wrapperRef.current.offsetHeight - titleRef.current.offsetHeight)
                        
                        
                        chartInstanceRef.current = new Chart(chartRef.current, {
                            type: 'bar',
                            data: {
                            datasets: [{
                                label: 'Chuva Acumulada',
                                data,
                                backgroundColor: 'rgba(20, 167, 224, 0.8)',
                                borderRadius: 1,
                            }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                          unit: 'hour',
                                          tooltipFormat: 'DD/MM/YYYY HH:mm',
                                          displayFormats: {
                                            hour: 'HH:mm', // Exibindo o formato desejado no eixo X
                                          },
                                        },
                                        title: {
                                          display: false,
                                          text: 'Data'
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: false,
                                            text: 'Chuva (mm)'
                                        }
                                    }
                                }
                            }
                        })
                    }
                // },1000)
            }
        }

        start()

        
        
        
    }, [counter])

    const outsideClick = () =>{
        setShow(false)
    }

    return (
        <div onClick={_=>{outsideClick()}} className={`${styles.container} ${show ? styles.show : ''}`}>
            <div onClick={e=>e.stopPropagation()} className={styles.wrapper} ref={wrapperRef}>
                <div ref={titleRef} className={styles.title_container}>
                    <DatePicker/>
                    <div className={styles.title}>CHUVA AGORA - SIBH</div>
                </div>
                <div className={styles.body} style={{height: tamanho}}>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
    )
}

export default ModalChart