import axios from 'axios'
import stations from '../data/stations'
import stationsFlu from '../data/stationsFlu'

const fetchMeasurements = async (context) =>{
     
    // return res.data.measurements
    let res
    if(context === 'rain'){
        res = await axios.get('https://cth.daee.sp.gov.br/sibh/api/v2/measurements/now?station_type_id=2&hours=3&show_all=false&serializer=complete&public=true')
        res = res?.data?.measurements
    } else {
        res = stationsFlu.measurements
    }

        
        
    
    
    
    return res
}

export {
    fetchMeasurements
}