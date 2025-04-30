import axios from 'axios'
import moment from 'moment'
import stations from '../data/stations'
import stationsFlu from '../data/stationsFlu'

const fetchMeasurements = async (context) =>{
     
    let res
    if(context.context === 'rain' || context.context === 'ppdc'){
        res = await axios.get(`https://cth.daee.sp.gov.br/sibh/api/v2/measurements/now?station_type_id=2&hours=${context.hours}&show_all=false&serializer=complete&public=true`)
        res = res?.data?.measurements
    } else if(context.context === 'level') {
        res = await axios.get(`https://cth.daee.sp.gov.br/sibh/api/v2/measurements/now_flu?references[]=extravasation&references[]=emergency&references[]=alert&references[]=attention&with_one_ref=true`)
        res = res?.data?.measurements
    }    
    
    return res
}

const fetchStationMeasurements = async (
    station_id,
    { start_date = moment().utc().subtract(1, 'day').format('YYYY-MM-DD HH:mm'), end_date = moment().utc().format('YYYY-MM-DD HH:mm')} = {}
)=>{
    
    let res = await axios.get(`https://cth.daee.sp.gov.br/sibh/api/v2/measurements?station_prefix_ids[]=${station_id}&start_date=${start_date}&end_date=${end_date}`)

    return res.data.measurements

}

const feachCityLimiares = async() =>{
    let res = await axios.get('https://cth.daee.sp.gov.br/sibh/api/v2/cities?parameter_type_ids[]=4')

    res = res.data.map(x=> ({cod_ibge: x.cod_ibge, name: x.name, limiares: x.parameters[0].values['2024-01-01'].limiares}))

    return res
}

export {
    fetchMeasurements,fetchStationMeasurements,feachCityLimiares
}