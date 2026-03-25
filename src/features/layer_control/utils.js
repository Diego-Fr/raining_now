import hidroicon from '@assets/hidrografia.png'

const addLayer = (map, layer_name, filter, options={}, callbacks={}) =>{
    let l = L.tileLayer.wms('https://geodados.daee.sp.gov.br/geoserver/ows', {
        layers: layer_name,
        format: 'image/png8',
        transparent: true,
        styles: options.style || '',
        CQL_FILTER: filter || '',
        env: options.env || ''
    }).addTo(map)

    l.on('loading', function () {
        callbacks.onLoading && callbacks.onLoading()
    });

    l.on('load', function () {
        callbacks.onLoad && callbacks.onLoad()
    });

    return l
}

const getBoundingBox  = (coords) => {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
  
    coords.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    });
    
    return [ [minY, minX], [maxY, maxX]];
}

const iconByLayer = layer_id =>{
    console.log(layer_id);
    
    switch(layer_id){
        case 'hidro':
            return hidroicon
        default:
            return ''
    }
}

export {
  addLayer,getBoundingBox, iconByLayer
}