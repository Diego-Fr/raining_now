import { getRadarLastImagesKeys } from "../../services/api";
import * as turf from '@turf/turf'

const getImages = async (hours=2) =>{

    let keys  = await getRadarLastImagesKeys('pnova', hours) || []
    
    return keys.map(key=>({
        key: key.Key,
        link: "https://cth.daee.sp.gov.br/sibh/api/v2/s3/image?key="+key.Key
    }))

    
}

const showCircle = map =>{

    const circle = turf.circle(
        [-45.972222, -23.600000],
        203.14,
        { units: 'kilometers', steps: 64 }
    );
    let l
    try{
        l = L.geoJSON(circle, {
        style: {
            color: 'black',
            weight: 2,
            dashArray: '5,10',
            fill: false,
            opacity: 0.5
        }
        }).addTo(map);
    } catch(e){
        console.log(e, 'erro ao adicionar círculo')
        return true
    }

    return l
}

const positionFollower = (follower, item, number) =>{

    let bound = item?.getBoundingClientRect()
    follower.style.left = `${bound.width * number+1 + (bound.width/2)}px`
    
}


export {
    getImages,
    showCircle,
    positionFollower
}

