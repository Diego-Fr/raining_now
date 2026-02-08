import { getRadarLastImagesKeys } from "../../services/api";

const getImages = async (hours=2) =>{

    let keys  = await getRadarLastImagesKeys('pnova', hours) || []
    
    return keys.map(key=>({
        key: key.Key,
        link: "https://cth.daee.sp.gov.br/sibh/api/v2/s3/image?key="+key.Key
    }))

    
}

const showCircle = map =>{
    try{
        let l = L.circle([-23.600795, -45.97279], {
            radius: 203140, //em metros - raiz quadrada da Área / PI = raio
            color:'black',
            opacity: 0.5,
            fill:false,
            dashArray: '5, 10',
            weight: 2
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

