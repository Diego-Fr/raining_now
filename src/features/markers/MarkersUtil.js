import statesFlu from "../../data/statesFlu"

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
    return 'normal'
}

export {
    getCurrentFluState,
    getCurrentPluState
}