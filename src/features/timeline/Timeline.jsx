
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Timeline.module.scss'
import { getImages, positionFollower, showCircle } from './Utils'
import moment from 'moment'
import { FaPlay, FaPause } from "react-icons/fa6";
import { toast } from 'react-toastify'


const Timeline = () =>{

    const [items, setItems] = useState([])
    const map = useSelector(state=>state.map.map)
    const radarOptions = useSelector(state=>state.radar)
    const stationOptions = useSelector(state=>state.station)
    const contextOptions = useSelector(state=>state.context)
    // const [active, setActive] = useState(true)
    
    const [config, setConfig] = useState({
        active:true,
        showingIndex: 0,
        showingCircle: false,
        speed: 5,
        play: true,
        showHoverFollowing: false,
        speedOptions: [1, 2, 5]
    })


    const showingOverlay  = useRef()
    const itemsRef = useRef([])
    const followerRef = useRef()
    const followerHoverRef = useRef()

    const containerRef = useRef()

    const imageBounds = [[-21.425445, -48.290929], [-25.740584, -43.577082]];


    useEffect(_=>{
        const Images = async () =>{

            let images =  await getImages(contextOptions.hours)
            
            if(images.length > 0){
                setItems(images.map(x=>({link:x.link, key: x.key})))    
            } else {
                setItems([])
                toast.info('Sem imagens de radar no período')
            }
            
        }
        
        if(stationOptions.stations.length > 0 && contextOptions.context && contextOptions.hours && radarOptions.show){            
            Images()      
        }      
        
        
    },[stationOptions.stations])

    useEffect(_=>{        
        if(map && config.active && items?.length > 0 && radarOptions.show){
            if(!itemsRef.current[config.showingIndex]){
                setConfig(state=>({
                    ...state,
                    showingIndex: 0
                }))
                return
            }
            positionFollower(followerRef.current,  itemsRef.current[config.showingIndex],config.showingIndex)
            
            // followerRef.current.innerHTML = moment(items[config.showingIndex]?.key, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm')
            
            if(showingOverlay.current){                
                map.removeLayer(showingOverlay.current)
            }
            
            let overlay = L.imageOverlay(items[config.showingIndex].link, imageBounds).addTo(map)
            showingOverlay.current = overlay
            
            if(!config.showingCircle){

                let l = showCircle(map)

                setConfig(state=>({
                    ...state,
                    showingCircle: l
                }))
            }

            if(config.play){
                const timer = setTimeout(_=>{
                    setConfig(state => ({
                        ...state,
                        showingIndex:  state.showingIndex + 1 === items.length ? 0 : state.showingIndex + 1
                    }))
                },((Math.max(...config.speedOptions) - config.speed + 1)) * 1000)
                
                return () => clearTimeout(timer);
            }
            
        } else {
            if(showingOverlay.current){
                map.removeLayer(showingOverlay.current)
            }

            if(config.showingCircle){
                map.removeLayer(config.showingCircle)
                setConfig(state=>({
                    ...state,
                    showingCircle: false
                }))
            }
        }
        
    }, [map, items, config.active, config.showingIndex, config.play,radarOptions.show])


    const itemClickHandler = (index) =>{   
        // console.log(index);
        setConfig(state => ({
            ...state,
            showingIndex:  items[index] ? index : state.showingIndex
        }))
        itemMouseLeaveHandler()

    }

    const itemMouseEnterHandler = (index) =>{
        // let itemsRef.current[index]);
        if(index != config.showingIndex){
            setConfig(state=>({
                ...state,
                showHoverFollowing: true
            }))
            let follower = followerHoverRef.current
            positionFollower(follower, itemsRef.current[index], index)
            follower.innerHTML = moment(parseDateFromKey(items[index]?.key), 'YYYYMMDDHHmm').subtract(3, 'hours').format('DD-MM-YYYY HH:mm')
        }
        
    }

    const itemMouseLeaveHandler = (index) =>{
        // let itemsRef.current[index]);
        
        setConfig(state=>({
            ...state,
            showHoverFollowing: false
        }))
    }

    const parseDateFromKey = key =>{
        let key_size = key.length
        // console.log(key,key.substring((key_size+1), key.length));
        
        return key.substring(key.lastIndexOf('/')+1, key_size.length)
    }

    const playButtonClickHandler = _ =>{
        setConfig(state=>({
            ...state, play: !state.play
        }))
    }

    const speedButtonClickHandler = value =>{
        setConfig(state=> ({
            ...state,
            speed: value
        }))
    }

    return (
        items.length > 0 && radarOptions.show &&
            <div ref={containerRef} className={styles.container}>
                <div type='button' className={styles.playButton} onClick={playButtonClickHandler}>
                    {config.play ? 
                        <FaPause /> :
                        <FaPlay />
                    }
                </div>
                <div className={styles.itemsWrapper}>
                    <div className={styles.followContainer}>
                        <div ref={followerHoverRef} className={`${styles.followWrapper} ${styles.follow} ${config.showHoverFollowing ? styles.show : ''} `}></div>
                        <div ref={followerRef} className={styles.followWrapper}>{items[config.showingIndex] && moment(parseDateFromKey(items[config.showingIndex]?.key), 'YYYYMMDDHHmm').subtract(3, 'hours').format('DD-MM-YYYY HH:mm')}</div>
                    </div>
                    <div className={styles.itemsContainer}>
                    {
                        items?.map((item, index)=> <div 
                            onClick={_=>itemClickHandler(index)}
                            onMouseEnter={_=>itemMouseEnterHandler(index)} 
                            onMouseLeave={_=>itemMouseLeaveHandler()} 
                            key={index} 
                            ref={el=>itemsRef.current[index] = el} 
                            className={`${styles.item} 
                            ${config.showingIndex >= index ? styles.active : ''}`}></div> 
                        )
                    }
                    </div>
                    <div className={styles.bottomWrapper}>
                        <div className={styles.speedContainer}>
                            {config.speedOptions.map((x,index)=> <div key={index} onClick={_=>speedButtonClickHandler(x)} className={`${styles.item} ${x === config.speed ? styles.active : ''}`}>{x}x</div> )}
                        </div>
                    </div>
                </div>
            </div>
        
    )
}

export default Timeline