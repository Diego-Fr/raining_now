
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Timeline.module.scss'
import { getImages, positionFollower, showCircle } from './Utils'
import moment from 'moment'
import { FaPlay, FaPause } from "react-icons/fa6";
import { toast } from 'react-toastify'
import Draggable from './Draggable'
import {setTimelineItems,setTimelineShowingIndex} from '@store/timelineSlice'


const Timeline = () =>{

    const timelineOptions = useSelector(state=>state.timeline)
    const items = useSelector(state=>state.timeline.items)
    const map = useSelector(state=>state.map.map)
    const radarOptions = useSelector(state=>state.radar)
    const stationOptions = useSelector(state=>state.station)
    const contextOptions = useSelector(state=>state.context)
    
    const draggableContainer = useRef()
    
    const [followConfig, setFollowConfig] = useState({
        left: 0
    })

    const [config, setConfig] = useState({
        active:true,
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

    const dispatch = useDispatch()

    useEffect(_=>{
        const Images = async () =>{

            let images =  await getImages(contextOptions.hours)
            
            if(images.length > 0){
                dispatch(setTimelineItems(images.map(x=>({link:x.link, key: x.key}))))
            } else {
                setItems([])
                toast.info('Sem imagens de radar no período')
            }
            
        }
        
        if(stationOptions.stations.length > 0 && contextOptions.context && contextOptions.hours && radarOptions.show){            
            Images()      
        }      
        
        
    },[stationOptions.stations,radarOptions.show])

    useEffect(_=>{        
        if(map && config.active && items?.length > 0 && radarOptions.show){
            // console.log('tetnado',items?.length);
            // console.log(items[timelineOptions.showingIndex]);
            
            if(!items[timelineOptions.showingIndex]){
                setConfig(state=>({
                    ...state,
                    showingIndex: 0
                }))
                return
            }
            // positionFollower(followerRef.current,  itemsRef.current[timelineOptions.showingIndex],timelineOptions.showingIndex)
            
            // followerRef.current.innerHTML = moment(items[timelineOptions.showingIndex]?.key, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm')
            
            if(showingOverlay.current){                
                showingOverlay.current.setUrl(items[timelineOptions.showingIndex].link, imageBounds);
            } else {
                console.log(items[timelineOptions.showingIndex]);
                let overlay = L.imageOverlay(items[timelineOptions.showingIndex].link, imageBounds).addTo(map)
                showingOverlay.current = overlay
            }

            // if(showingOverlay.current){                
            //     map.removeLayer(showingOverlay.current)
            // }
            
            
            
            if(!config.showingCircle){

                let l = showCircle(map)

                setConfig(state=>({
                    ...state,
                    showingCircle: l
                }))
            }

            if(config.play){
                const timer = setTimeout(_=>{
                    dispatch(setTimelineShowingIndex(timelineOptions.showingIndex + 1 === items.length ? 0 : timelineOptions.showingIndex + 1))
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
        
    }, [map, items, config.active, timelineOptions.showingIndex, config.play,radarOptions.show])

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

    const onMoveHandler = data =>{
        let item_size = data.total / items.length
        let index = Math.round(data.left / item_size)
        

        dispatch(setTimelineShowingIndex(items[index] ? index : timelineOptions.showingIndex))
        

        setFollowConfig(state=>({
            ...state,
            left: data.left
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
                    {/* <div ref={followContainerRef} className={styles.followContainer}>
                        
                    </div> */}

                <div ref={followerHoverRef} className={`${styles.followWrapper} ${styles.follow} ${config.showHoverFollowing ? styles.show : ''} `}></div>
                <div style={{left:followConfig.left}} ref={followerRef} className={styles.followWrapper}>{items[timelineOptions.showingIndex] && moment(parseDateFromKey(items[timelineOptions.showingIndex]?.key), 'YYYYMMDDHHmm').subtract(3, 'hours').format('DD-MM-YYYY HH:mm')}</div>

                    {/* <div className={styles.itemsContainer}>
                    {
                        items?.map((item, index)=> <div 
                            onClick={_=>itemClickHandler(index)}
                            onMouseEnter={_=>itemMouseEnterHandler(index)} 
                            onMouseLeave={_=>itemMouseLeaveHandler()} 
                            key={index} 
                            ref={el=>itemsRef.current[index] = el} 
                            className={`${styles.item} ${timelineOptions.showingIndex >= index ? styles.active : ''}`}></div> 
                        )
                    }
                    </div> */}
                    <div className={styles.timeline} ref={draggableContainer}>
                        <Draggable containerRef={draggableContainer} onMove={onMoveHandler}></Draggable>
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