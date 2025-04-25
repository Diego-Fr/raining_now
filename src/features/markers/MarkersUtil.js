import statesFlu from "../../data/statesFlu"
import statesPlu from "../../data/statesPlu"

const getCurrentFluState = station =>{
    let keys = Object.keys(statesFlu)
    
    keys.forEach(key=>{
        if(station.value >= station[key]){
            return key
        } 
    })

    return 'normal'

}

const getCurrentPluState = station =>{
    if(station.value >= 70){
        return 'high'
    } else if(station.value >= 30){
        return 'medium'
    } else if(station.value >=10){
        return 'low'
    } 
    return 'normal'
}

export {
    getCurrentFluState,
    getCurrentPluState
}