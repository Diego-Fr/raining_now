const showLayer = (map, layer_name, filter) =>{
    let l = L.tileLayer.wms('https://geodados.daee.sp.gov.br/geoserver/ows', {
        layers: layer_name,
        format: 'image/png8',
        transparent: true,
        // styles: 'estadual_chuva_agora',
        attribution: '© Seu GeoNode',
        CQL_FILTER: filter || ''
    }).addTo(map)
    return l
}

const getBoundingBox  = (bboxes) => {
    let minLat = Infinity;
    let minLng = Infinity;
    let maxLat = -Infinity;
    let maxLng = -Infinity;
  
    // Percorre cada BBox e atualiza os limites mínimo e máximo
    bboxes.forEach(bbox => {
      const [lowerLeft, upperRight] = bbox;
      const [latMin, lngMin] = lowerLeft;
      const [latMax, lngMax] = upperRight;
  
      minLat = Math.min(minLat, latMin);
      minLng = Math.min(minLng, lngMin);
      maxLat = Math.max(maxLat, latMax);
      maxLng = Math.max(maxLng, lngMax);
    });
  
    // Retorna o BBox resultante
    return [
      [minLat, minLng], // canto inferior esquerdo
      [maxLat, maxLng]  // canto superior direito
    ];
  }

export {
    showLayer,getBoundingBox
}