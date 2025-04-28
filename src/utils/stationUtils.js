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

export {
    classifyStation
}