
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

    const imageBounds = [[-21.444795, -48.33879], [-25.756795, -43.60679]];

    const dispatch = useDispatch()

    useEffect(_=>{
        const Images = async () =>{

            let images =  await getImages(contextOptions.hours)
            
            if(images.length > 0){
                dispatch(setTimelineItems(images.map(x=>({link:x.link, key: x.key}))))
            } else {
                dispatch(setTimelineItems([]))
                toast.info('Sem imagens de radar no período')
            }
            
        }
        
        if(stationOptions.stations.length > 0 && contextOptions.context && contextOptions.hours && radarOptions.show){            
            Images()      
        }      
        
        
    },[stationOptions.stations,radarOptions.show])


    useEffect(_=>{        
        if(map && items?.length > 0 && radarOptions.show){
            
            if(!items[timelineOptions.showingIndex]){
                dispatch(setTimelineShowingIndex(0))
                return
            }

            if(showingOverlay.current){                
                showingOverlay.current.setUrl(items[timelineOptions.showingIndex].link, imageBounds);
            } else {
                let overlay = L.imageOverlay(items[timelineOptions.showingIndex].link, imageBounds).addTo(map)
                showingOverlay.current = overlay
            }
            
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
                showingOverlay.current = undefined
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
        let item_size = data.total / (items.length-1)
        let index = Math.round(data.left / item_size)
        

        dispatch(setTimelineShowingIndex(items[index] ? index : timelineOptions.showingIndex))
        

        // setFollowConfig(state=>({
        //     ...state,
        //     left: data.left
        // }))
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
                    <div className={styles.timeline} ref={draggableContainer}>
                        <Draggable containerRef={draggableContainer} onMove={onMoveHandler} text={items[timelineOptions.showingIndex] && moment(parseDateFromKey(items[timelineOptions.showingIndex]?.key), 'YYYYMMDDHHmm').subtract(3, 'hours').format('DD-MM-YYYY HH:mm')}></Draggable>
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