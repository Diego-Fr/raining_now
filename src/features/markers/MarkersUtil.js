import statesFlu from "../../data/statesFlu"
import statesPlu from "../../data/statesPlu"

const getCurrentFluState = station =>{
    let keys = Object.keys(statesFlu)

    let state

    keys.forEach(key=>{
        
        if(station[key] && station.value >= parseFloat(station[key])){
            
            state = key
        } 
    })

    return state || 'normal'

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