const showLayer = (map, layer_name, filter) =>{
    let l = L.tileLayer.wms('https://geodados.daee.sp.gov.br/geoserver/ows', {
        layers: layer_name,
        format: 'image/png8',
        transparent: true,
        // styles: 'estadual_chuva_agora',
        attribution: '© Seu GeoNode',
        CQL_FILTER: filter
    }).addTo(map)
    return l
}

export {
    showLayer
}