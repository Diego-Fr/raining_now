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

//a api de ugrhis não retorna bbox (diferente de cities/subugrhis), então busca a geometria da camada no
//geoserver e calcula o bbox a partir das coordenadas, no mesmo formato [[south,west],[north,east]] usado pelo fitBounds
const feachUgrhiBbox = async(cod) =>{
    let res = await axios.get(`https://geodados.daee.sp.gov.br/geoserver/sibh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sibh%3Augrhis_sp&outputFormat=application%2Fjson&CQL_FILTER=ogc_fid%20in%20(${cod})`)

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity

    const walk = coords =>{
        if(typeof coords[0] === 'number'){
            const [lng, lat] = coords
            minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng)
            minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat)
        } else {
            coords.forEach(walk)
        }
    }

    res.data?.features?.forEach(f => f.geometry && walk(f.geometry.coordinates))

    if(!isFinite(minLng)) return null

    return [[minLat, minLng], [maxLat, maxLng]]
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

const searchAddress = async (query, abortController) =>{
    const url = `https://photon.komoot.io/api/?q=${query}&osm_tag=place:municipality`
    let res = await axios.get(url, {signal: abortController.signal})
  
    return res
}

async function getCityByPoint(lat, lng) {
    
  const url = `https://geodados.daee.sp.gov.br/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=geonode:municipios_sp&outputFormat=application/json&CQL_FILTER=INTERSECTS(geometry,SRID=4326;POINT(${lng} ${lat}))`;

  const res = await axios.get(url);

  return res.data;
}

export {
    fetchMeasurements,fetchStationMeasurements,feachCityLimiares,feachCitiesBbox,feachSubugrhisBbox,feachUgrhiBbox,updateMeasurementStatus,getRadarLastImagesKeys,fetchLightnings,
    searchAddress, getCityByPoint
}