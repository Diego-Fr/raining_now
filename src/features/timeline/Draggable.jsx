import { useEffect, useRef, useState } from 'react';
import styles from './Draggable.module.scss'
import {useSelector} from 'react-redux'

const Draggable = ({containerRef, onMove, text}) =>{

    const itemRef = useRef()
    const [position, setPosition] = useState({
        left:0
    })

    const positionRef = useRef(position)
    const internalUpdateRef = useRef(false)

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
    
    //mouse move event
    const mouseMove = (e) =>{        
        
        let bounds = containerRef.current.getBoundingClientRect()
        let itemBounds = itemRef.current.getBoundingClientRect()

        let newLeft = e.clientX - bounds.left - (itemBounds.width / 2)

        let step = bounds.width / (timelineOptions.items.length - 1)
        newLeft = newLeft < 0 ? 0 : newLeft > bounds.width ? bounds.width : newLeft
        
        // if(Math.abs(newLeft % step) <= (step*0.2) && newLeft != positionRef.current.left){
        if(newLeft != positionRef.current.left){
            internalUpdateRef.current = true
            setPosition(state=>({
                ...state,
                left: newLeft,
                
            }))          

            positionRef.current.left = newLeft
        }
        
    }

    const getBounds = el =>{
        return el.getBoundingClientRect()
    }

    //quando a position do handler for alterada
    useEffect(_=>{
        let bounds = getBounds(containerRef.current)
        
        //verificando tbm se a alteração da posição foi interna ou externa
        onMove && internalUpdateRef.current ?
            onMove({...position, total:bounds.width}) 
            : null

    },[position])

    //quando alterar o current index por outras vias, como play automático
    useEffect(_=>{
        let bounds = containerRef.current.getBoundingClientRect()

        let step = bounds.width / (timelineOptions.items.length - 1)

        let left = step * timelineOptions.showingIndex
        internalUpdateRef.current = false
        
        setPosition(state=>({
            ...state,
            left: left,
        }))        
        
    },[timelineOptions.showingIndex])

    useEffect(_=>{
        
        if(timelineOptions.items.length > 0 && containerRef.current){
            
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
        <div style={{...position}} className={styles.dragWrapper}>
            <div className={styles.text}>{text}</div>
            <div ref={itemRef} className={styles.container} onMouseDown={mouseDown} onMouseUp={mouseUp}></div>
        </div>
    )
}

export default Draggable