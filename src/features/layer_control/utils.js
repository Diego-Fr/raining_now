const addLayer = (map, layer_name, filter, options={}) =>{
    let l = L.tileLayer.wms('https://geodados.daee.sp.gov.br/geoserver/ows', {
        layers: layer_name,
        format: 'image/png8',
        transparent: true,
        styles: options.style || '',
        CQL_FILTER: filter || ''
    }).addTo(map)
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

export {
  addLayer,getBoundingBox
}