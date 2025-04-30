const classifyStation = (station, context) =>{
    let classification
    if(context === 'rain'){
        if(station.value < 10){
            classification = 'normal'
        } else if(station.value < 30){
            classification = 'low'
        } else if(station.value < 70){
            classification = 'medium'
        } else {
            classification = 'high'
        }
    } else if(context === 'level'){
        
        if(station.extravasation && station.value >= parseFloat(station.extravasation)){
            classification = 'extravasation'
        } else if(station.emergency && station.value >= parseFloat(station.emergency)){
            classification = 'emergency'
        } else if(station.alert && station.value >= parseFloat(station.alert)){
            classification = 'alert'
        } else if(station.attention && station.value >= parseFloat(station.attention)){
            classification = 'attention'
        } else {
            classification = 'normal'
        }
    }
    return {...station, legend:classification}
    
}

const statsByCity = stations =>{
    let obj = {}

    stations.forEach(station=>{
        obj[station.cod_ibge] =  obj[station.cod_ibge] || {max:-Infinity, min:Infinity, sum: 0, qtd: 0}

        obj[station.cod_ibge].max = Math.max(obj[station.cod_ibge].max, station.value)
        obj[station.cod_ibge].min = Math.min(obj[station.cod_ibge].min, station.value)
        obj[station.cod_ibge].sum += station.value
        obj[station.cod_ibge].qtd += 1
    })    

    return obj
}

export {
    classifyStation,
    statsByCity
}
