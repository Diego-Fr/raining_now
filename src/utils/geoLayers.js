import axios from "axios"

const getGeoCities = async () =>{
    let res = await axios.request({
        method: 'GET',
        url: 'https://geodados.daee.sp.gov.br/geoserver/sibh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sibh%3Amunicipios_sp&outputFormat=application%2Fjson&maxFeatures=5000'
    })

    return res.data
    
}

export {
    getGeoCities
}