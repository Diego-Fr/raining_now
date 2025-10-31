import moment from "moment";

function generateMarkerSVG(lightning){   
    let diff = moment().diff(moment(lightning.datetime), 'minutes')
    let opacity = .3
    if(diff <= 30){
        opacity = 1
    } else if(diff <= 60){
        opacity = .8
    } else if(diff <= 120){
        opacity = .5
    }
        
    let html = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">'
    // let style = buildMarkerStyle(station)

    html += `<path 
        d="M75 10 
           L35 70 
           H55 
           L40 110 
           L85 55 
           H65 
           Z"
        fill="#FFD700"
        stroke="#DAA520"
        stroke-width="5"
        opacity="${opacity}"
        stroke-linejoin="round"
        stroke-linecap="round" />`
    
    return html + '</svg>'
}

export {
    generateMarkerSVG
}