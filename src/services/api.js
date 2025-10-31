import axios from 'axios'
import moment from 'moment'

const fetchMeasurements = async (context) =>{     
    let res
    if(context.context === 'rain' || context.context === 'ppdc'){
        let url = `https://apps.spaguas.sp.gov.br/sibh/api/v2/measurements/now?station_type_id=2&hours=${context.hours}&show_all=false&serializer=complete&public=true`

        if(context.endDate != undefined){           
            //esperando que seja moment
            url += `&from_date=${context.endDate.add(3, 'hours').format('YYYY-MM-DD HH:mm')}`
        }

        res = await axios.get(url)

        res = res?.data?.measurements
    } else if(context.context === 'level') {
        res = await axios.get(`https://apps.spaguas.sp.gov.br/sibh/api/v2/measurements/now_flu?references[]=extravasation&references[]=emergency&references[]=alert&references[]=attention&with_one_ref=true`)
        res = res?.data?.measurements
    }    
    
    return res
}

const fetchStationMeasurements = async (
    station_id,
    { 
        start_date = moment().utc().subtract(1, 'day').format('YYYY-MM-DD HH:mm'), 
        end_date = moment().utc().format('YYYY-MM-DD HH:mm'),
        groupType='minute',
        token = ''
    } = {},
    
)=>{
    
    let res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}measurements?station_prefix_ids[]=${station_id}&start_date=${start_date}&end_date=${end_date}&group_type=${groupType}`, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return res.data.measurements

}

const feachCityLimiares = async() =>{
    let res = await axios.get('https://apps.spaguas.sp.gov.br/sibh/api/v2/cities?parameter_type_ids[]=4')

    res = res.data.map(x=> ({cod_ibge: x.cod_ibge, name: x.name, limiares: x.parameters[0].values['2024-01-01'].limiares}))

    return res
}


const feachCitiesBbox = async(cods) =>{
    let res = await axios.get(`https://apps.spaguas.sp.gov.br/sibh/api/v2/cities?with_bbox=true&${cods.map(cod=> `cod_ibges[]=${cod}`).join('&')}`)

    return res.data
}

const feachSubugrhisBbox = async(cods) =>{
    let res = await axios.get(`https://apps.spaguas.sp.gov.br/sibh/api/v2/subugrhis?with_bbox=true&${cods.map(cod=> `cods[]=${cod.replace('.','')}`).join('&')}`)

    return res.data
}

const updateMeasurementStatus = async(id, status, token) =>{
    console.log(token);
    
    let res = await axios.post(`https://apps.spaguas.sp.gov.br/sibh/api/v2/measurements/${id}/classification`, {
        status: status
    }, {headers:{Authorization: `Bearer ${token}`}})

    return res.data
}

const getRadarLastImagesKeys = async (radarName, hours) =>{
    let res = await axios.get(`https://apps.spaguas.sp.gov.br/sibh/api/v2/s3/radar/last_images?radar_name=${radarName}&hours=${hours}`)

    return res.data.Contents
}

const fetchLightnings = async () =>{
    let res = await axios.get('https://apps.spaguas.sp.gov.br/sibh/api/v2/lightnings/last_lightnings')

    return res.data
}

export {
    fetchMeasurements,fetchStationMeasurements,feachCityLimiares,feachCitiesBbox,feachSubugrhisBbox,updateMeasurementStatus,getRadarLastImagesKeys,fetchLightnings
}