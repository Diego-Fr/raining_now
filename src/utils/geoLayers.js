import axios from "axios"

const getGeoCities = async () =>{
    let res = await axios.request({
        method: 'GET',
        url: 'https://geodados.daee.sp.gov.br/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3Amunicipios_sp_simplify&maxFeatures=1000&outputFormat=application%2Fjson'
    })

    return res.data
    
}

export {
    getGeoCities
}