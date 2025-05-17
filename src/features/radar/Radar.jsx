
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Radar.module.scss'
import { getImages } from './Utils'

const Radar = () =>{

    const [items, setItems] = useState(['1','2', '3', '4'])
    const map = useSelector(state=>state.map.map)
    const [active, setActive] = useState(true)

    const containerRef = useRef()

    const imageBounds = [[-23.5, -47.5], [-22.5, -46.5]];

    

    useEffect(_=>{
        const Images = () =>{
            return getImages()
        }

        let images = Images()

        setItems(images.map(x=>x.link))

        console.log(images);

        // console.log(map);
        
        
        
    },[])

    useEffect(_=>{
        if(map && active){
            console.log(items);
            items.map(x=>L.imageOverlay(x, imageBounds).addTo(map))
            
        }
        
    }, [map, items])


    return (
        <div ref={containerRef} className={styles.container}>
            {
                items.map(item=> <div className={styles.items}></div> )
            }
        </div>
    )
}

export default Radar