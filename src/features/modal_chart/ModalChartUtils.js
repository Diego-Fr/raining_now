import moment from "moment"
import { Chart, PointElement, BarController, Filler, LineElement,LineController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale } from 'chart.js'
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import {formatDateToBrazil} from '@/utils/dateUtils'

Chart.register(BarController, BarElement, CategoryScale, Filler, zoomPlugin, LinearScale, Tooltip, Legend,TimeScale,LineController,LineElement,PointElement)

const generatePluChart = async (measurements, chart_element, zoomEventHandle) =>{
    
    let data = measurements.map(m=> ({x: formatDateToBrazil(m.date).toDate(), y:m.value})).sort((x,y)=> x.x - y.x )
    let acumData = data.reduce((acc, measurement, index) => { 
        acc[index - 1] ? acc.push({x: measurement.x, y: acc[index-1].y + measurement.y}) : 
        acc.push({x: measurement.x, y:measurement.y}); return acc}
    ,[])

    
    
    let chart =  new Chart(chart_element, {
        data: {
        datasets: [
            {
                label: 'Chuva',
                data,
                backgroundColor: 'rgba(20, 167, 224, 0.9)',
                borderRadius: 1,
                type: 'bar',
            },
            {
                label: 'Chuva Acumulada',
                data: acumData,
                borderColor: 'rgba(20, 167, 224, 0.3)',
                backgroundColor: 'rgba(20, 167, 224, 0.05)',
                fill: true,
                type: 'line',
                pointRadius: 0,
                tension: 0.1
            },

        ]
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
            },
            plugins: {
                zoom: {
                    zoom: {
                        mode: 'x',
                        drag: {
                            enabled: true,
                            threshold: 30
                            
                        },
                        onZoom: _ => {
                            zoomEventHandle()                     
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
                
            },
           
            
        }
    })

    return chart
}

const generateFluChart = async (measurements, chart_element, zoomEventHandle) =>{
    let data = measurements.map(m=> ({x: formatDateToBrazil(m.date).toDate(), y:m.value})).sort((x,y)=> x.x - y.x )    
    let data_vazao = measurements.map(m=> ({x: formatDateToBrazil(m.date).toDate(), y:m.read_value})).sort((x,y)=> x.x - y.x ).filter(x=>x.y != undefined)
    
    let datasets = [
        {
            label: 'Nível',
            data,
            backgroundColor: 'rgba(20, 167, 224, 0.9)',
            borderColor: 'rgba(20, 167, 224, 0.5)',
            borderRadius: 0.1,
            type: 'line',
            tension: 0.0,
            yAxisID: 'y'
        }
    ]
    if(data_vazao.length > 0){
        datasets.push({
            label: 'Vazão',
            data: data_vazao,
            backgroundColor: 'rgba(224, 20, 197, 0.9)',
            borderColor: 'rgba(224, 20, 197, 0.5)',
            borderRadius: 1,
            type: 'line',
            tension: 0.0,
            yAxisID: 'y1'
        })
    }

    let chart =  new Chart(chart_element, {
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
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
                    beginAtZero: false,
                    title: {
                        display: false
                    },
                    position: 'left'
                },
                y1: {
                    beginAtZero: false,
                    title: {
                        display: false
                    },
                    position: 'right'
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        mode: 'x',
                        drag: {
                            enabled: true,
                            threshold: 30
                            
                        },
                        onZoom: _ => {
                            zoomEventHandle()                     
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
                
            },
           
            
        }
    })

    return chart
}

export {generatePluChart,generateFluChart}