import { useEffect, useRef, useState } from 'react';
import styles from './Draggable.module.scss'
import {useSelector} from 'react-redux'

const Draggable = ({containerRef, onMove}) =>{

    const itemRef = useRef()
    const [position, setPosition] = useState({
        left:0,
        block:false
    })

    const positionRef = useRef(position)

    const interv = useRef()

    const [followOptions, setFollow] = useState({
        active: false
    })

    const timelineOptions = useSelector(state=>state.timeline)


    const mouseDown = () =>{
        setFollow(state=>({
            ...state,
            active: true
        }))
    }

    const mouseUp = () =>{
        setFollow(state=>({
            ...state,
            active: false
        }))
    }

    const block = () =>{
        // if(!interv){
        //     console.log('BLOQUEANDO');
        //     interv = setTimeout(_=>{
        //         positionRef.current.block = true
        //         interv=undefined
        //     },300)
        // } else {
        //     console.log('ta bloqueado');
            
        // }
    }
    
    const mouseMove = e =>{        
        
        let bounds = containerRef.current.getBoundingClientRect()
        let itemBounds = itemRef.current.getBoundingClientRect()

        let newLeft = e.clientX - bounds.left - (itemBounds.width / 2)

        let step = bounds.width / timelineOptions.items.length

        
        if(Math.abs(newLeft % step) <= (step*0.2) && newLeft != positionRef.current.left){
            setPosition(state=>({
                ...state,
                left: newLeft < 0 ? 0 : newLeft > bounds.width ? bounds.width : newLeft,
                
            }))
            console.log('tentando lboquear');
            
            block()            
        }
        
    }

    const getBounds = el =>{
        return el.getBoundingClientRect()
    }

    useEffect(_=>{
        positionRef.current = position
    },[position])


    useEffect(_=>{
        let bounds = getBounds(containerRef.current)
        onMove && !positionRef.current.block ? 
            onMove({...position, total:bounds.width}) 
            : null
    },[position])

    useEffect(_=>{
        
        if(timelineOptions.items.length > 0 && containerRef.current){
            console.log('tem');
            
            let width = getBounds(containerRef.current).width
            let step = width / timelineOptions.items.length
            let current = parseInt(step * timelineOptions.showingIndex)
            // console.log(current);
            
            // setPosition(state=>({
            //     ...state,
            //     left: current
            // }))
        }
    },[timelineOptions.showingIndex])

    

    useEffect(_=>{        
        if(followOptions.active){
            window.addEventListener('mousemove', mouseMove)
            window.addEventListener('mouseup', mouseUp);
        } 

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        };
    }, [followOptions])

    

    return (
        <div ref={itemRef}  style={{...position}} className={styles.container} onMouseDown={mouseDown} onMouseUp={mouseUp}></div>
    )
}

export default Draggable