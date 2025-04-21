import axios from 'axios'

const fetchMeasurements = async () =>{
    const res = await axios.get('https://cth.daee.sp.gov.br/sibh/api/v2/measurements/now?station_type_id=2&hours=3&show_all=false&serializer=complete&public=true')
    return res.data.measurements
}

export {
    fetchMeasurements
}