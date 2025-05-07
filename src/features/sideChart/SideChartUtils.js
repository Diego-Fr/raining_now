import moment from "moment"
import { Chart, PointElement, BarController, Filler, LineElement,LineController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale } from 'chart.js'
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import {formatDateToBrazil} from '@/utils/dateUtils'
import { classifyStation } from "../../utils/stationUtils";
import statesPlu from "../../data/statesPlu";

Chart.register(BarController, BarElement, CategoryScale, Filler, zoomPlugin, LinearScale, Tooltip, Legend,TimeScale,LineController,LineElement,PointElement)

const generateSideChart = async (dataList, chart_element, onBarClick = () => {}, onHover = () => {}, labelField = 'prefix', valueField = 'value') =>{
    
    dataList = dataList.sort((x,y)=> y.value - x.value ) //ordenando
    let data = dataList.map(m=> m[valueField].toFixed(1))
    let labels = dataList.map(m=>  m[labelField].substring(0,15))    
    
    let chart =  new Chart(chart_element, {
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Acumulado',
                    data,
                    backgroundColor: data.map(x=> statesPlu[classifyStation({value:x}, 'rain').legend].color)  ,
                    borderRadius: 1,
                    type: 'bar',
                }

            ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                onClick: (e, els, chart) =>{
                    if(els.length > 0){
                        onBarClick(dataList[els[0].index])
                    }
                },
                onHover: (e, els, chart) =>{
                    if(els.length > 0){
                        onHover(dataList[els[0].index])
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff' // cor branca para os labels do eixo Y
                        },
                        title: {
                            display: false,
                            text: 'Chuva (mm)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff', // cor do texto da legenda
                        }
                    }
                },
            
                
            }
        })

    return chart
}

const top20rain = stations =>{
    
    
    return [...stations].sort((x,y)=>y.value - x.value).slice(0,40)
}

const maxByCity = stations =>{
    let cities = {}
    stations.forEach(station=>{
        let {city, value, cod_ibge, city_id} = station
        cities[city] = cities[city] || {}
        cities[city].cod_ibge = cod_ibge
        cities[city].city_id = city_id
        cities[city].value = Math.max(cities[city].value || 0, value)
    })

    return Object.entries(cities).map(x=>({city: x[0], ...x[1]}))
    
}

const maxByField = (stations, field) =>{

    let objs = {}
    stations.forEach(station=>{
        let {value} = station
        objs[station[field]] = objs[station[field]] || {...station}
        objs[station[field]].value = Math.max(objs[station[field]].value || 0, value)
    })    

    return Object.entries(objs).map(x=>({[field]: x[0], ...x[1]}))

}

export {
    generateSideChart,
    top20rain,
    maxByCity,
    maxByField
}